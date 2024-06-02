import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

interface Birthday {
  text: string;
  year: number;
}

interface FavoriteBirthdaysProps {
  favoriteBirthdays: Birthday[];
  removeFromFavorites: (index: number) => void;
  selectedDate: Date | null; // Add selectedDate prop
}

const FavoriteBirthdays: React.FC<FavoriteBirthdaysProps> = ({
  favoriteBirthdays,
  removeFromFavorites,
  selectedDate, // Destructure selectedDate prop
}) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="w-full p-4 mb-4 overflow-auto bg-white rounded-md shadow-md h-[64.8%] relative ">
      <h2 className="mb-4 text-lg font-bold">Favorite Birthdays</h2>
      {favoriteBirthdays.length === 0 ? (
        <p className="mt-4 text-gray-500">No favorite birthdays</p>
      ) : (
        <>
          {selectedDate && ( // Check if selectedDate exists
            <p className="mb-2 font-bold text-gray-700">
              Selected Date: {format(selectedDate, "MM/dd/yyyy")}
            </p>
          )}
          <ul>
            {favoriteBirthdays
              .slice(0, showAll ? undefined : 6)
              .map((birthday, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between mb-2"
                >
                  <span className="text-gray-700">
                    {birthday.text} ({birthday.year})
                  </span>
                  <button
                    className="text-red-500 focus:outline-none"
                    onClick={() => removeFromFavorites(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}
      {FavoriteBirthdays.length > 0 && (
        <div className="relative text-center ">
          <button
            className="px-4 py-2 font-bold text-white bg-black rounded hover:bg-blue-700"
            onClick={toggleShowAll}
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoriteBirthdays;
