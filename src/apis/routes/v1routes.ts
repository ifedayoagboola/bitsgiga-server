import roleRouter from '@src/apis/v1/rolesModule/role.routes';
import storeRoleRouter from '@src/apis/v1/storeRoleModule/storeRole.routes';
import walletRouter from '@src/apis/v1/walletModule/wallet.route';
import { Router } from 'express';
import authRouter from '../v1/authModule/auth.route';
import storeRouter from '../v1/storeModule/store.route';
import categoryRouter from '@src/apis/v1/categoriesModule/categories.routes';
import productRouter from '@src/apis/v1/productModule/product.route';
import paymentRouter from '../v1/paymentModule/payment.route';
import cartRouter from '../v1/cartModule/cart.route';
import orderRouter from '../v1/orderModule/order.route';
import addressBookRouter from '../v1/addressBookModule/addressBook.route';
import ratingsRouter from '../v1/ratingsModule/ratings.route';
import notificationRouter from '../v1/notificationsModule/notification.route';
import dashboardRouter from '../v1/dashboardModule/dashboard.routes';
import wishlistRouter from '../v1/wishlistModule/wishlist.routes';
import transactionRouter from '../v1/transactionModule.ts/transactions.route';
import waitlistRouter from '../v1/waitlist/waitlist.route';
import uploadsRouter from '@src/apis/v1/uploadsModule/uploads.routes';

const v1Router = Router();

v1Router.use('/store', storeRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/wallet', walletRouter);
v1Router.use('/role', roleRouter);
v1Router.use('/storeRole', storeRoleRouter);
v1Router.use('/category', categoryRouter);
v1Router.use('/product', productRouter);
v1Router.use('/category', categoryRouter);
v1Router.use('/payment', paymentRouter);
v1Router.use('/cart', cartRouter);
v1Router.use('/order', orderRouter);
v1Router.use('/addressBook', addressBookRouter);
v1Router.use('/rating', ratingsRouter);
v1Router.use('/notification', notificationRouter);
v1Router.use('/wishlist', wishlistRouter);
v1Router.use('/dashboard', dashboardRouter);
v1Router.use('/transactions', transactionRouter)
v1Router.use('/waitlist', waitlistRouter);
v1Router.use('/uploads', uploadsRouter);

export default v1Router;
