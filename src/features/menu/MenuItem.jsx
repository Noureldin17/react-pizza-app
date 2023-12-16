import { formatCurrency } from '../../utils/helpers.js';
import PropTypes from 'prop-types';
import Button from '../../ui/Button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, getCurrentQuantityById } from '../cart/cartSlice.js';
import DeleteItem from '../cart/DeleteItem.jsx';
import UpdateItemQuantity from '../cart/UpdateItemQuantity.jsx';

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const dispatch = useDispatch();
  const isInCart = currentQuantity > 0;
  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name: name,
      quantity: 1,
      unitPrice: unitPrice,
      totalPrice: unitPrice * 1,
    };
    dispatch(addItem(newItem));
  }
  return (
    <li className={'flex gap-4 py-2'}>
      <img
        className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
        src={imageUrl}
        alt={name}
      />
      <div className={'flex flex-grow flex-col'}>
        <p className={'font-medium'}>{name}</p>
        <p className={'text-sm capitalize italic text-stone-500'}>
          {ingredients.join(', ')}
        </p>
        <div className={'mt-auto flex items-center justify-between '}>
          {!soldOut ? (
            <p className={'text-sm'}>{formatCurrency(unitPrice)}</p>
          ) : (
            <p className={'text-sm font-medium uppercase text-stone-500'}>
              Sold out
            </p>
          )}

          <span className={'flex items-center gap-3 space-x-2 sm:gap-8'}>
            {isInCart && (
              <UpdateItemQuantity
                pizzaId={id}
                currentQuantity={currentQuantity}
              />
            )}
            {isInCart && <DeleteItem pizzaId={id} />}
            {!soldOut && !isInCart && (
              <Button onClick={handleAddToCart} type={'small'}>
                Add to cart
              </Button>
            )}
          </span>
        </div>
      </div>
    </li>
  );
}

MenuItem.propTypes = {
  pizza: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    unitPrice: PropTypes.number.isRequired,
    ingredients: PropTypes.array.isRequired,
    soldOut: PropTypes.bool.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default MenuItem;
