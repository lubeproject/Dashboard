import React from 'react';
import "./main.css";
import PageTitle from '../header/PageTitle';
import Dashboard from './Dashboard';

export default function Main() {
  return (
    <main id='main' className='main'>
        <PageTitle page="Dashboard" />
        <Dashboard />
    </main>
  )
}
