import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { insertPlace, selectPlaces } from "../db";
import Place from "../model/place";
import { extractErrorMessage } from "../utils";
import { URL_GEOCODING } from "../utils/maps";

const initialState = {
  places: [],
  isLoading: false,
};

export const savePlace = createAsyncThunk("place/savePlace", async (place, thunkAPI) => {
  try {
    const response = await fetch(URL_GEOCODING(place.coords.lat, place.coords.lng));

    if (!response.ok) {
      return thunkAPI.rejectWithValue("Algo ha salido mal!");
    }

    const data = await response.json();
    if (!data.results) thunkAPI.rejectWithValue("No se ha podido encontrar la dirección del lugar");

    const address = data.results[0].formatted_address;
    const result = await insertPlace(place.title, place.image, address, place.coords);

    const newPlace = new Place(result.insertId, place.title, place.image, address, place.coords);

    return newPlace;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

export const getPlace = createAsyncThunk("places/getPlace", async (_, thunkAPI) => {
  try {
    const res = await selectPlaces();
    return res.rows?._array;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const placeSlice = createSlice({
  name: "place",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(savePlace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(savePlace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.places.push(action.payload);
      })
      .addCase(savePlace.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getPlace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPlace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.places = action.payload;
      })
      .addCase(getPlace.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default placeSlice.reducer;
