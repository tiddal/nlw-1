import { Request, Response } from 'express';
import knex from '../database/connection';

export default class ItemsController {
	async index(request: Request, response: Response) {
		const items = await knex('Item').select('*');
		const serializedItems = items.map(({ id, title, image }) => ({
			id,
			title,
			item_url: `http://192.168.0.115:3333/uploads/${image}`,
		}));

		return response.json(serializedItems);
	}
}
