import React, { useContext } from 'react';
import useAxiosPublic from './useAxiosPublic';
import AuthContext from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';

const AllTask = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    const { data: tasks = [], isLoading, error, refetch } = useQuery({
        queryKey: ["tasks", user?.email],
        queryFn: async () => {
            const data = await axiosPublic.get(`/tasks/${user?.email}`)
            console.log(data.data)
            return data.data;
        },

    });

    return [tasks,isLoading,error,refetch];
};

export default AllTask;