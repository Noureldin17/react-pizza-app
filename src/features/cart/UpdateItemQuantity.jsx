import Button from '../../ui/Button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  decreaseItemQuantity,
  getCurrentQuantityById,
  increaseItemQuantity,
} from './cartSlice.js';

function UpdateItemQuantity({ pizzaId, currentQuantity }) {
  const dispatch = useDispatch();
  return (
    <div className={'flex items-center gap-1 md:gap-3'}>
      <Button
        onClick={() => dispatch(decreaseItemQuantity(pizzaId))}
        type={'round'}
      >
        -
      </Button>
      <p>{currentQuantity}</p>
      <Button
        onClick={() => dispatch(increaseItemQuantity(pizzaId))}
        type={'round'}
      >
        +
      </Button>
    </div>
  );
}
export default UpdateItemQuantity;
