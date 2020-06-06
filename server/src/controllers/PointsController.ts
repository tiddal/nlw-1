import { Request, Response } from 'express';
import knex from '../database/connection';

export default class PointsController {
	async index(request: Request, response: Response) {
		const { city, uf, items } = request.query;
		const parsedItems = String(items)
			.split(',')
			.map((item) => Number(item.trim()));

		const points = await knex('Point')
			.join('point_item', 'Point.id', '=', 'point_item.point_id')
			.whereIn('point_item.item_id', parsedItems)
			.where('city', String(city))
			.where('uf', String(uf))
			.distinct()
			.select('Point.*');

		const serializedPoints = points.map((point) => ({
			...point,
			image: `http://192.168.0.115:3333/uploads/${point.image}`,
		}));

		return response.json(serializedPoints);
	}

	async show(request: Request, response: Response) {
		const { id } = request.params;
		const point = await knex('Point').where({ id }).first();

		if (!point)
			return response.status(404).json({ message: 'Point not found' });

		const serializedPoint = {
			...point,
			image: `http://192.168.0.115:3333/uploads/${point.image}`,
		};

		const items = await knex('Item')
			.join('point_item', 'Item.id', 'point_item.item_id')
			.where({ point_id: id })
			.select('title');
		return response.json({ ...serializedPoint, items });
	}

	async create(request: Request, response: Response) {
		const {
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			uf,
			items,
		} = request.body;

		const point = {
			image: request.file.filename,
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			uf,
		};

		const transaction = await knex.transaction();

		const [point_id] = await transaction('Point').insert(point);

		const pointItems = items
			.split(',')
			.map((item: string) => Number(item.trim()))
			.map((item_id: number) => ({
				item_id,
				point_id,
			}));

		await transaction('point_item').insert(pointItems);
		await transaction.commit();
		return response.status(201).json({ id: point_id, ...point });
	}
}
