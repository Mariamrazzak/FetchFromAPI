import { useState, useEffect, useReducer} from "react";
import axios from 'axios';

export const useDataApi = (initialUrl, initialParams) => {
  const [fetchInfo, setFetchData] = useState({url: initialUrl, params: initialParams});

  const [state, dispatch] = useReducer(dataFetchReducer, { // useReducer is similar to useState but it accepts a reducer of type (state, action) => newState (e.g dataFetchReducer) and the initial state, and returns the current 'state' paired with a 'dispatch' method
    isLoading: false,
    isError: false,
    data: {}
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(fetchInfo.url, {
          params: fetchInfo.params
        });
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data }); // when we call the dispatch function received from the useReducer, it will call the reducer function (e.g dataFetchReducer)
        }                                                            // and pass the current value of the state and the action (e.g. { type: "FETCH_SUCCESS", payload: result.data })
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [fetchInfo]); // Only run useEffect and consequently fetchData when fetchInfo (url or params) changes

  return [state, setFetchData];
};

const dataFetchReducer = (state, action) => { // in the reducer we allways have access to the current state and the action that trigger the reducer to be called by the dispatch method
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};
