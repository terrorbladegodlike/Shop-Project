import express, { Router, Request, Response } from "express";
import {getProduct, getProducts, removeProduct, searchProducts, updateProduct} from "../models/products.model";
import {IProductSearchPayload} from "@Shared/types";
import {IProductEditData} from "../types";
import {throwServerError} from "./helpers";

export const adminProductsRouter = Router();

adminProductsRouter.get('/', async (req: Request, res: Response) => {
    try {
        console.log(req.session.username);
        const products = await getProducts();
        res.render("./products", {
            items: products,
            queryParams: {}
        });
    } catch (err: any) {
        throwServerError(res, err);
    }
});

adminProductsRouter.get('/search', async (
    req: Request<{}, {}, {}, IProductSearchPayload>,
    res: Response
) => {
    try {
        const products = await searchProducts(req.query);
        res.render("products", {
            items: products,
            queryParams: req.query
        });
    } catch (err: any) {
        throwServerError(res, err);
    }
});

adminProductsRouter.get('/:id', async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const product = await getProduct(req.params.id);

        if (product) {
            res.render("product/product", {
                item: product
            });
        } else {
            res.render("product/empty-product", {
                id: req.params.id
            });
        }
    } catch (err: any) {
        throwServerError(res, err);
    }
});

adminProductsRouter.get('/remove-product/:id', async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        if (req.session.username === 'admin') {
            await removeProduct(req.params.id);
            res.redirect(`/${process.env.ADMIN_PATH}`);
        } else {
            res.status(403);
            res.send('Forbidden!');
            return;
        }
    } catch (e: any) {
        throwServerError(res, e);
    }
});

adminProductsRouter.post('/save/:id', async (
    req: Request<{ id: string }, {}, IProductEditData>,
    res: Response
) => {
    try {
       await updateProduct(req.params.id, req.body);
        res.redirect(`/${process.env.ADMIN_PATH}/${req.params.id}`);
    } catch (err: any) {
        throwServerError(res, err);
    }
});
