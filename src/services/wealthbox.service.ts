import axios from 'axios';

interface WealthboxUser {
  id: number;
  email: string;
  name: string;
  account: number;
  excluded_from_assignments: boolean;
}

interface WealthboxUsersResponse {
  users: WealthboxUser[];
}

export const fetchWealthboxUsers = async (apiToken: string): Promise<WealthboxUser[]> => {
  try {
    const response = await axios.get('https://api.crmworkspace.com/v1/users', {
      headers: {
        'ACCESS_TOKEN': `${apiToken}`,
        'Accept': 'application/json',
      },
    });

    return response.data.users;
  } catch (error) {
    console.error('Error fetching Wealthbox users:', error);
    throw new Error('Failed to fetch Wealthbox users');
  }
};