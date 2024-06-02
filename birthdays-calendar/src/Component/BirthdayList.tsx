import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as filledStar } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";

interface Birthday {
  text: string;
  year: number;
}

interface BirthdayListProps {
  birthdays: Birthday[];
  addToFavorites: (birthday: Birthday) => void;
  favoriteBirthdays: Birthday[];
  selectedDate: Date | null;
}

const BirthdayList: React.FC<BirthdayListProps> = ({
  birthdays,
  addToFavorites,
  favoriteBirthdays,
  selectedDate,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToFavorites = (birthday: Birthday) => {
    if (favoriteBirthdays.some((fav) => fav.text === birthday.text)) {
      toast.warn("The birthday is already in favorite!");
    } else {
      addToFavorites(birthday);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const visibleBirthdays = showAll ? birthdays : birthdays.slice(0, 6);

  const isFavorite = (birthday: Birthday) => {
    return favoriteBirthdays.some((fav) => fav.text === birthday.text);
  };

  const formattedDate = selectedDate ? format(selectedDate, "MM/dd/yyyy") : "";

  return (
    <div className="w-full p-4 mb-4 bg-white rounded-md shadow-md h-96">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">Birthdays</h2>
          {formattedDate && (
            <h3 className="text-gray-600 text-md">
              Selected Date: {formattedDate}
            </h3>
          )}
        </div>
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute text-gray-400 top-3 left-3"
          />
          <input
            type="text"
            placeholder="Search birthdays"
            className="py-1 pl-10 pr-2 border border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {birthdays.length > 0 ? (
        <>
          <ul
            className={`overflow-y-auto ${
              birthdays.length > 6 ? "scroll-smooth h-56 mb-4" : "h-full"
            }`}
          >
            {visibleBirthdays
              .filter((birthday) =>
                birthday.text.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((birthday, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between mb-2"
                >
                  <span className="text-gray-700">
                    {birthday.text} ({birthday.year})
                  </span>
                  <button
                    className="text-yellow-500 focus:outline-none"
                    onClick={() => handleAddToFavorites(birthday)}
                  >
                    <FontAwesomeIcon
                      icon={isFavorite(birthday) ? filledStar : emptyStar}
                    />
                  </button>
                </li>
              ))}
          </ul>
          {birthdays.length > 0 && (
            <div className="relative text-center ">
              <button
                className="px-4 py-2 font-bold text-white bg-black rounded hover:bg-blue-700"
                onClick={toggleShowAll}
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data found</p>
        </div>
      )}
    </div>
  );
};

export default BirthdayList;
