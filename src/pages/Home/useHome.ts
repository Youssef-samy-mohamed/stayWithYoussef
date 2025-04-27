import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { actGetHotels } from "../../store/hotels/hotelsSlice";

const useHome = () => {
  const dispatch = useAppDispatch();
  const { hotels, loading, error } = useAppSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(actGetHotels());
  }, [dispatch]);

  return { hotels, loading, error };
};

export default useHome;
