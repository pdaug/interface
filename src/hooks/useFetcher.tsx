import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

const useFetch = (options: AxiosRequestConfig) => {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | unknown | null>(null);

  useEffect(
    function () {
      let cancel = false;
      const fetchData = async function () {
        setLoading(true);
        try {
          const response = await axios(options);
          if (!cancel) {
            setData(response.data);
            setError(null);
          }
        } catch (err) {
          if (!cancel) {
            setError(err);
            setData(null);
          }
        } finally {
          if (!cancel) {
            setLoading(false);
          }
        }
      };
      fetchData();
      return function () {
        cancel = true;
      };
    },
    [options],
  );

  return { data, error, loading };
};

export default useFetch;
