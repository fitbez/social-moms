import { React, useState, useEffect } from "react";
import Header from "./Header";
import Nav from "./Nav";
import "./search.css";

const apiKey = process.env.REACT_APP_yelp_API_KEY;

const Search = () => {
  const [businesses, setbusiness] = useState([]);
  const [term, setTerm] = useState("");
  const [location, setLocation] = useState("");
  const [isNotValid, setIsNotValid] = useState(true);
  const [sortBy, setSortBy] = useState("best_match");

  const fechData = async (term, location, sortBy) => {
    const response = await fetch(
      "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" +
        term +
        "&location=" +
        location +
        "&sort_by=" +
        sortBy +
        "&GoodforKids",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const newData = await response.json();
    setbusiness(newData.businesses);
    console.log(businesses);
  };

  useEffect(() => {
    fechData("library", "silver spring", "best_match");
  }, []);

  const sortByOptions = {
    "Best Match": "best_match",
    "Highest Rated": "rating",
    "Most Reviewed": "review_count",
  };

  const getSortByClass = (sortByOption) => {
    if (sortBy === sortByOption) {
      return "active";
    } else {
      return "";
    }
  };

  const handleSortByChange = (sortByArgument) => {
    setSortBy(sortByArgument);
  };

  const sort = Object.keys(sortByOptions);

  const renderSortByOptions = () => {
    return sort.map((sortByOption) => {
      console.log(sortByOption);
      let sortByOptionValue = sortByOptions[sortByOption];
      return (
        <li
          className={getSortByClass(sortByOptionValue)}
          onClick={(e) => {
            handleSortByChange(sortByOptionValue);
            handleSearch(e);
          }}
          key={sortByOptionValue}
        >
          {getSortByClass(sortByOptionValue) === "active" ? (
            <i class="fas fa-check"></i>
          ) : (
            ""
          )}
          {sortByOption}
        </li>
      );
    });
  };

  const handleSearch = (event) => {
    if (term !== "" && location !== "") {
      setIsNotValid(false);
      fechData(term, location, sortBy);
      event.preventDefault();
    } else {
      // alert("Please select acitvity and location");
      setSortBy("best_match");
    }
  };

  return (
    <div>
      <Nav />
      <Header />
      <div className="search_activity">
        <label htmlFor="yelp-select">
          Navigate To Kids Friendly Places-Powered by YELP
        </label>
        <div className="activity">
          <div className="select">
            <select
              name="business"
              id="business-select"
              onChange={(e) => {
                setTerm(e.target.value);
                console.log(term, location);
              }}
            >
              <option value="">Select Activity </option>
              <option value="Playgrounds">Playgrounds</option>
              <option value="Splash Parks">Splash Parks</option>
              <option value="Kid-Friendly Restaurants">Restaurants</option>
              <option value="Libraries">Libraries</option>
              <option value="Museums">Museums</option>
              <option value="Kid-Activities">Kid Events</option>
              <option value="Schools">Schools</option>
              <option value="Hospitals">Hospitals</option>
            </select>
            <span className="focus"></span>
          </div>
          <div className="select">
            <select
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            >
              <option value="">Select city</option>
              <option value="Arlington">Arlington, Va</option>
              <option value="20011">Washington, DC</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles, Ca</option>
            </select>
            <span className="focus"></span>
          </div>
          <button
            className="btn"
            onClick={handleSearch}
            disabled={!term || !location}
          >
            Search
          </button>
        </div>

        <div className="SearchBar-sort-options">
          <ul>{renderSortByOptions()}</ul>
        </div>
      </div>
      <div className="search_results">
        {businesses.map((business) => {
          return (
            <div key={business.id} className="search_card">
              <img src={business.image_url} alt={business.name} />
              <div className="business_info">
                <p>{business.name} </p>
                <p>{business.rating} </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Search;
