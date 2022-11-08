import React, {Fragment, useState, useEffect, useReducer} from "react";
import  { createRoot }  from 'react-dom/client';
import axios from 'axios';

const useDataApi = (initialUrl, initialParams) => {
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


// App that gets data from unsplash api
function App() {
  const defaultUrl = "https://api.unsplash.com/search/photos"; // For more information on this API check the documentation here: https://unsplash.com/documentation#search-photos
  const secretAccessKey = "m5DFFeLWRrp8KPMvwmHSnqwx8uMFuvWMscKWgIEkl3A";
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('Food');
  const [{ data, isLoading, isError }, updateAndFetch] = useDataApi(
    defaultUrl,
    {
      method: 'get',
      query: title,
      client_id: secretAccessKey
    }
  );
  console.log('data: ', data)
  const page = data?.results;
  return (
    <Fragment>
      <h1 style={{marginLeft:"40px", marginTop: "20px"}}>Search images by a topic of your interest</h1>
      <form
        style={{marginLeft:"40px", marginTop: "20px"}}
        onSubmit={event => {
          updateAndFetch({url: defaultUrl, params: {
            method: 'get',
            query: query,
            client_id: secretAccessKey
          }});
          setTitle(query[0].toUpperCase() + query.slice(1))
          event.preventDefault();
        }}
      >
        <input
          type="string"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button style={{marginLeft:"10px"}} type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {title && <h2 style={{marginLeft:"40px", marginTop: "20px"}}>{title}</h2>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul  style=
            {{listStyle: 'none', columns: 3}}>
          {page?.map(item => (
            <li key={item.id}>
                <a href={item}><img src={item.urls.small} style={{width: 400}}></img></a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

// ========================================
createRoot(document.getElementById("root")).render(<App/>);