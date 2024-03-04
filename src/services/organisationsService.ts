import DavraApi from './davraApi';
import type { Organisation } from '../types';

const getUserOrganisations = async (): Promise<Organisation[]> => {
  try {
    const { data } = await DavraApi().get<any>('/user/organisations', {
      headers: {
        Accept: 'application/json',
      },
    });

    return data;
  } catch (error) {
    throw new Error('Organisations API Error');
  }
};
const getOrganisationByUUID = async (uuid: string): Promise<Organisation> => {
  try {
    const { data } = await DavraApi().get<any>(
      '/api/v1/organisations/' + uuid,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    return data;
  } catch (error) {
    throw new Error('Organisations API Error');
  }
};

const getCurrentOrganisation = async (): Promise<Organisation> => {
  try {
    const { data } = await DavraApi().get<any>('/user/currentOrganisation', {
      headers: {
        Accept: 'application/json',
      },
    });

    return data;
  } catch (error) {
    throw new Error('Organisations API Error');
  }
};
const getCurrentUser = async (): Promise<any> => {
  try {
    const { data } = await DavraApi().get<any>('/user', {
      headers: {
        Accept: 'application/json',
      },
    });

    return data;
  } catch (error) {
    throw new Error('User API Error');
  }
};

const switchOrganisation = async (uuid: string): Promise<any> => {
  try {
    const { data } = await DavraApi().put<any>(
      '/user/currentOrganisation',
      {
        organisation: uuid,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    return data;
  } catch (error) {
    throw new Error('Organisations API Error');
  }
};

export default {
  getUserOrganisations,
  getOrganisationByUUID,
  getCurrentOrganisation,
  switchOrganisation,
  getCurrentUser,
};
