import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant.js';
import Button from '../../ui/Button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart } from '../cart/cartSlice.js';
import EmptyCart from '../cart/EmptyCart.jsx';
import store from '../../Store.js';
import { fetchAddress } from '../user/userSlice.js';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: 'Mediterranean',
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: 'Vegetale',
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: 'Spinach and Mushroom',
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  // const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const isLoadingStatus = addressStatus === 'loading';
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const formErrors = useActionData();
  const cart = useSelector(getCart);
  const dispatch = useDispatch();
  if (!cart.length) return <EmptyCart />;
  return (
    <div className={'px-4 py-6'}>
      <h2 className={'mb-8 text-xl font-semibold'}>
        Ready to order? Let&apos;s go!
      </h2>
      <Form method={'POST'}>
        <div className={'mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'}>
          <label className={'sm:basis-40'}>First Name</label>
          <input
            className={'input grow'}
            type="text"
            defaultValue={username}
            name="customer"
            required
          />
        </div>

        <div className={'mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'}>
          <label className={'sm:basis-40'}>Phone number</label>
          <div className={'grow'}>
            <input
              className={'input w-full'}
              type="tel"
              name="phone"
              required
            />
            {formErrors?.phone ? (
              <p
                className={
                  'mt-2 rounded-md bg-red-100 p-0.5 text-xs text-red-700'
                }
              >
                {formErrors.phone}
              </p>
            ) : null}
          </div>
        </div>

        <div
          className={
            'relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center '
          }
        >
          <label className={'sm:basis-40'}>Address</label>
          <div className={'grow'}>
            <input
              className={'input w-full'}
              type="text"
              name="address"
              disabled={isLoadingStatus}
              defaultValue={address}
              required
            />
            {addressStatus === 'error' ? (
              <p
                className={
                  'mt-2 rounded-md bg-red-100 p-0.5 text-xs text-red-700'
                }
              >
                {errorAddress}
              </p>
            ) : null}
          </div>
          {!position.latitude && !position.longitude && (
            <span
              className={
                'absolute right-[3.5px] top-[34.5px] z-50 sm:right-[4.5px] sm:top-[4.5px]'
              }
            >
              <Button
                disabled={isLoadingStatus}
                type={'small'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get Position
              </Button>
            </span>
          )}
        </div>

        <div className={'mb-12 flex items-center gap-5'}>
          <input
            className={
              ' h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2'
            }
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className={'font-medium'} htmlFor="priority">
            Give my order higher priority!
          </label>
        </div>

        <div>
          <input name={'cart'} type={'hidden'} value={JSON.stringify(cart)} />
          <Button type={'primary'} disabled={isSubmitting || isLoadingStatus}>
            {isSubmitting ? 'submitting...' : 'Order now'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'on',
  };
  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone = 'Please provide a valid phone number';
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }
  const newOrder = await createOrder(order);
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
