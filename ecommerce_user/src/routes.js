import ProductPage from "./pages/ProductPage/ProductPage";
import SignInPage from './pages/Sign/SignInPage'
import SignUpPage from './pages/Sign/SignUpPage'
import NotFound from './pages/NotFound/NotFound'
import CartPage from "./pages/CartPage/CartPage";
import OrderPage from "./pages/OrderPage/OrderPage";
import DetailProductPage from "./pages/ProductPage/DetailProductPage";
import SearchPage from './pages/SearchPage/SearchPage'
import DiscountPage from "./pages/DiscountPage/DiscountPage";

const routes = [
    {
        path: '/',
        exact: true,
        main: () => <ProductPage />
    },
    {
        path: '/cart',
        exact: true,
        main: ({ history }) => <CartPage history={history} />
    },
    {
        path: '/order',
        exact: true,
        main: ({ history }) => <OrderPage history={history} />
    },
    {
        path: '/search/:keyword',
        exact: false,
        main: ({ history, match }) => <SearchPage match={match} history={history} />
    },
    {
        path: '/discount',
        exact: true,
        main: ({ history }) => <DiscountPage history={history} />
    },
    {
        path: '/brand/:id',
        exact: false,// dùng chung trang hiển thị giảm giá và trang hiển thị sản phẩm theo danh mục chung là DiscountPage
        main: ({ history }) => <DiscountPage history={history} />
    },
    {
        path: '/user/:id',
        exact: false,
        main: ({ match, history, location }) => <SignUpPage location={location} match={match} history={history} />
    },
    {
        path: '/signin',
        exact: true,
        main: ({ history }) => <SignInPage history={history} />
    },
    {
        path: '/signup',
        exact: true,
        main: ({ history, match }) => <SignUpPage match={match} history={history} />
    },
    {
        path: '/lineproduct/:id',
        exact: false,
        main: ({ match, history, location }) => <DetailProductPage location={location} match={match} history={history} />
    },
    {
        path: '',
        exact: false,
        main: () => <NotFound />
    },
]

export default routes;