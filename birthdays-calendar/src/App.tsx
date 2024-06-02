import React, { useState, useEffect } from "react";
import { DatePicker, PickersLocaleText } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import BirthdayList from "./Component/BirthdayList";
import FavoriteBirthdays from "./Component/FavoriteBirthdays";
import { format } from "date-fns";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

library.add(faTimes);

interface Birthday {
  text: string;
  year: number;
}

type CustomLocaleText = Partial<PickersLocaleText<Date>> & {
  date: (date: Date) => string;
};

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [favoriteBirthdays, setFavoriteBirthdays] = useState<Birthday[]>([]);

  useEffect(() => {
    if (selectedDate) {
      fetchBirthdays(selectedDate);
    }
  }, [selectedDate]);

  const fetchBirthdays = async (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;

    try {
      console.log("Url that is going to call ", url);
      const response = await fetch(url);
      const data = await response.json();
      const birthdays = data.births.map((birth: any) => ({
        text: birth.text,
        year: birth.year,
      }));
      setBirthdays(birthdays);
    } catch (error) {
      console.error("Error fetching birthdays:", error);
    }
  };

  const addToFavorites = (birthday: Birthday) => {
    setFavoriteBirthdays([...favoriteBirthdays, birthday]);
  };

  const removeFromFavorites = (index: number) => {
    const newFavorites = favoriteBirthdays.filter((_, i) => i !== index);
    setFavoriteBirthdays(newFavorites);
  };

  const localeText: CustomLocaleText = {
    date: (date) => format(date, "MMMM d, yyyy"),
  };

  return (
    <div className="flex flex-row items-start w-full h-screen m-16 justify-evenly">
      <div className="w-[20%] h-[80%] ml-10 mt-32">
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          localeText={localeText}
        >
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
          />
        </LocalizationProvider>
      </div>
      <div className="w-[40%] h-[80%] overflow-x-auto">
        <BirthdayList
          birthdays={birthdays}
          addToFavorites={addToFavorites}
          favoriteBirthdays={favoriteBirthdays}
          selectedDate={selectedDate}
        />
      </div>
      <div className="w-[30%] h-[80%] ml-15 mt-6 overflow-auto mr-12">
        <FavoriteBirthdays
          favoriteBirthdays={favoriteBirthdays}
          removeFromFavorites={removeFromFavorites}
          selectedDate={selectedDate} // Pass selectedDate as a prop
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
