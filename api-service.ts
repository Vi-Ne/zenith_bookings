export const apiService = {
  async saveUser(name: string, email: string) {
    try {
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  },

  async saveBooking(booking: any, userEmail: string) {
    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking, userEmail })
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving booking:', error);
      return false;
    }
  },

  async getExperts(field: string) {
    try {
      const response = await fetch(`http://localhost:3001/api/experts/${encodeURIComponent(field)}`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching experts:', error);
      return [];
    }
  },

  async addExpert(expert: any) {
    try {
      const response = await fetch('http://localhost:3001/api/experts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expert)
      });
      return response.ok;
    } catch (error) {
      console.error('Error adding expert:', error);
      return false;
    }
  }
};