import prisma from '@/prisma';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { ProductCreateDTOSchema } from '@/schemas';
import {INVENTORY_URL} from '@/config';


const createProduct = async (
    req: Request,
    res: Response,
    next:NextFunction
) => {
    try {
        // validate request body
        const parsedBody = ProductCreateDTOSchema.safeParse(req.body);
        if (! parsedBody.success) {
            return res
            .status(400)
            .json({ message: 'Invalid request request body', errors: parsedBody.error.errors})
        }

        // check if product with the same sku already exists
        const existingProduct = await prisma.product.findFirst({
            where: {
                sku: parsedBody.data.sku,
            },
        });

        if (existingProduct) {
            return res
                .status(400)
                .json({ message: 'product with the same SKU already exists'});
        }

        //Create product
        const product = await prisma.product.create({
            data: parsedBody.data,
        });
            console.log('Product created successfully', product.id);

        // Create inventory record for the product
        const { data: inventory } = await axios.post(
            `${INVENTORY_URL}/inventories`,
            {
                productId: product.id,
                sku: product.sku,
            }
        );

        console.log('Inventory created successfully', inventory.id)

        //update product and store inventory id

        await prisma.product.update({
            where: {id: product.id },
            data: {
                inventoryId: inventory.id,
            },
        });

        console.log('product updated successfully with inventory id', inventory.id);

        res.status(201).json({...product, inventoryId: inventory.id})
    } catch (err) {
        next(err);
    }
    }
export default createProduct;