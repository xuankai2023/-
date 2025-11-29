import * as DateGenerator from 'data-generator-retail';
export type ThemeName = 'light' | 'dark';

export type Product = DateGenerator.Product;

export type Category = DateGenerator.Category;

export type Customer = DateGenerator.Customer;

export type Order = DateGenerator.Order;

export type Review = DateGenerator.Review;

export type Invoice = DateGenerator.Invoice;

export type BasketItem = DateGenerator.BasketItem;

declare global{
    interface Window {
        restServer: any;
}
}