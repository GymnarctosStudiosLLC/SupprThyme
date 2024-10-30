import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import PreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm';
import preferencesReducer from '../../../../src/redux/reducers/preferencesReducer';
import * as PreferencesFormActions from '../../../../src/redux/actions/PreferencesForm.actions';

vi.mock('../../../../src/redux/actions/PreferencesForm.actions');

const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      user: (state = initialState.user) => state,
      preferences: preferencesReducer,
    },
    preloadedState: initialState,
  });
};

describe('PreferencesForm', () => {
  let store;

  beforeEach(() => {
    store = createMockStore({
      user: { id: 1 },
      preferences: {
        max_price_range: '',
        meat_preference: '',
        religious_restrictions: '',
        allergens: [],
        cuisine_types: [],
        max_distance: '',
        open_now: true,
        accepts_large_parties: true,
        priceRangeOptions: [
          { id: '1', range: '$' },
          { id: '2', range: '$$' },
          { id: '3', range: '$$$' },
          { id: '4', range: '$$$$' },
        ],
        meatPreferenceOptions: [
          { id: '1', preference: 'Vegetarian' },
          { id: '2', preference: 'Vegan' },
          { id: '3', preference: 'Non-vegetarian' },
        ],
        religiousRestrictionOptions: [
          { id: '1', restriction: 'Kosher' },
          { id: '2', restriction: 'Halal' },
          { id: '3', restriction: 'None' },
        ],
        allergenOptions: [
          { id: '1', allergen: 'Peanuts' },
          { id: '2', allergen: 'Shellfish' },
        ],
        cuisineOptions: [
          { id: '1', type: 'Italian' },
          { id: '2', type: 'Chinese' },
        ],
      },
    });

    vi.mocked(PreferencesFormActions.fetchPriceRanges).mockResolvedValue(undefined);
    vi.mocked(PreferencesFormActions.fetchMeatPreferences).mockResolvedValue(undefined);
    vi.mocked(PreferencesFormActions.fetchReligiousRestrictions).mockResolvedValue(undefined);
    vi.mocked(PreferencesFormActions.fetchAllergenOptions).mockResolvedValue(undefined);
    vi.mocked(PreferencesFormActions.fetchCuisineOptions).mockResolvedValue(undefined);
  });

  test('renders form fields correctly', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Max Price Range/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Meat Preference/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Religious Restrictions/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Cuisine Types/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Max Distance/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Open Now/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Accepts Large Parties/i)).toBeInTheDocument();
    });
  });

  test('allows setting and updating user preferences', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('max-price-range-select')).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByTestId('max-price-range-select'), '4');
    await userEvent.selectOptions(screen.getByTestId('meat-preference-select'), '1');
    await userEvent.selectOptions(screen.getByTestId('religious-restrictions-select'), '3');
    await userEvent.type(screen.getByTestId('max-distance-input'), '10');
    await userEvent.click(screen.getByTestId('open-now-switch'));
    await userEvent.click(screen.getByTestId('accepts-large-parties-switch'));

    await userEvent.click(screen.getByTestId('save-preferences-button'));

    expect(PreferencesFormActions.updatePreferences).toHaveBeenCalledWith(
      expect.objectContaining({
        max_price_range: '4',
        meat_preference: '1',
        religious_restrictions: '3',
        max_distance: '10',
        open_now: false,
        accepts_large_parties: false,
      })
    );
  });

  test('handles errors correctly', async () => {
    vi.mocked(PreferencesFormActions.updatePreferences).mockRejectedValue(new Error('Error updating preferences'));

    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('max-price-range-select')).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByTestId('max-price-range-select'), '4');
    await userEvent.selectOptions(screen.getByTestId('meat-preference-select'), '1');
    await userEvent.click(screen.getByTestId('save-preferences-button'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to update preferences. Please try again later.');
    });
  });

  test('shows validation error when required fields are not filled', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('save-preferences-button')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('save-preferences-button'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Please fill in all required fields.');
    });
  });

  test('cancel button opens confirmation dialog', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('cancel-button'));

    await waitFor(() => {
      expect(screen.getByText('Cancel Changes?')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to cancel? All unsaved changes will be lost.')).toBeInTheDocument();
    });
  });

  test('AllergenSelect integration', async () => {
    const setAllergensMock = vi.fn();
    vi.mocked(PreferencesFormActions.setAllergens).mockImplementation(setAllergensMock);

    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByTestId('preferences-form')).toBeInTheDocument();
    });

    // Simulate allergen selection
    const allergenSelect = screen.getByLabelText(/Allergens/i);
    expect(allergenSelect).toBeInTheDocument();

    await userEvent.type(allergenSelect, 'Peanuts');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(setAllergensMock).toHaveBeenCalled();
    });
  });
});
