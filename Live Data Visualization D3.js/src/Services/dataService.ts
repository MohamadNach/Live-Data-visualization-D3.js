//@ts-nocheck
import axios from 'axios';
import dayjs from 'dayjs';

const apiLink = import.meta.env.VITE_APP_API_LINK;
const corsProxy = import.meta.env.VITE_APP_CORS_PROXY;
const apiKey = import.meta.env.VITE_APP_API_KEY;

// Helper function to calculate expected number of observations
const calculatePageSize = (startTime: string, endTime: string) => {
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const totalMinutes = end.diff(start, 'minute'); // Total minutes between dates
  const observations = Math.ceil(totalMinutes / 3); // Divide by 3 for 3-minute intervals
  return observations;
};

export const fetchData = async (
  startTime: string,
  endTime: string,
  chartId: string
) => {
  try {
    // Calculate the page size based on the date range
    const pageSize = calculatePageSize(startTime, endTime);
    const response = await axios.get(
      `${corsProxy}${apiLink}${chartId}/data?start_time=${startTime}T00:00:00.000Z&end_time=${endTime}T23:59:59Z&format=json&pageSize=${pageSize}`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );
    const data = response.data.data;
    console.log(data);
    return data;
  } catch (error) {
    console.log('Error fetching data:', error);
    return null;
  }
};
