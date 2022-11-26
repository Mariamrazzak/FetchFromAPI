import React, {Fragment, useState} from "react";
import { useDataApi } from './fetchFromAPI';

import './App.css';

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
                <a href={item}>
                  <img alt={item.id} src={item.urls.small} style={{width: 400}} />
                </a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

export default App;
