import React from 'react';
import TaskAdd from '../task/TaskAdd';
import AllTaskShow from '../task/AllTaskShow';

const Home = () => {
    return (
        <div>
            <TaskAdd></TaskAdd>
            <AllTaskShow></AllTaskShow>
        </div>
    );
};

export default Home;