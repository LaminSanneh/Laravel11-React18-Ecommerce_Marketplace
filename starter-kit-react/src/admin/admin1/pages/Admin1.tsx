import React, { useState } from "react";
import { FaCoins, FaDollarSign } from "react-icons/fa";
import { FaCartShopping, FaPeopleGroup } from "react-icons/fa6";
import { topSellingProductsData } from "../dataSources/topSellingProductsData";
import "./Admin1.css";
import HorizontalBarChart from "./HorizontalBarChart";
import LineGraph from "./LineGraph";
import DoughnutChartSalesChannel from "./DoughnutChartSalesChannel";
import { salesChannelData } from "../dataSources/salesChannelData";
import DoughnutChartCountries from "./DoughnutChartCountries";
import TopologyMap from "./TopologyMap";
import { countryTrafficSourcesData2 } from "../dataSources/countryTrafficSourcesData";

const Admin1 = () => {
  return (
    <>
      <div className="p-5 bg-gray-100 h-full">
        <p className="text-4xl font-bold">Dashboard</p>
        <div className="grid grid-cols-4 gap-4 mt-6">
          <>
            <div className="flex p-4 bg-white rounded-lg shadow-xl border-b-4 border-b-emerald-300">
              <div className="flex-auto w-10/12">
                <div>
                  <p className="font-semibold">Total Sales</p>
                  <p className="text-3xl font-extrabold">$110, 019</p>
                </div>
                <p>last month</p>
              </div>
              <div className="flex-auto w-16 text-emerald-500">
                <FaCoins size={50} />
              </div>
            </div>
            <div className="flex p-4 bg-white rounded-lg shadow-xl border-b-4 border-b-sky-300">
              <div className="flex-auto w-10/12">
                <div>
                  <p className="font-semibold">Total Orders</p>
                  <p className="text-3xl font-extrabold">$110, 019</p>
                </div>
                <p>last month</p>
              </div>
              <div className="flex-auto w-16 text-sky-500">
                <FaCartShopping size={50} />
              </div>
            </div>
            <div className="flex p-4 bg-white rounded-lg shadow-xl border-b-4 border-b-indigo-300">
              <div className="flex-auto w-10/12">
                <div>
                  <p className="font-semibold">Total Profit</p>
                  <p className="text-3xl font-extrabold">$110, 019</p>
                </div>
                <p>last month</p>
              </div>
              <div className="flex-auto w-16 text-indigo-500">
                <FaDollarSign size={50} />
              </div>
            </div>
            <div className="flex p-4 bg-white rounded-lg shadow-xl border-b-4 border-b-pink-300">
              <div className="flex-auto w-10/12">
                <div>
                  <p className="font-semibold">New Customers</p>
                  <p className="text-3xl font-extrabold">$110, 019</p>
                </div>
                <p>last month</p>
              </div>
              <div className="flex-auto w-16 text-pink-500">
                <FaPeopleGroup size={50} />
              </div>
            </div>
          </>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-lg border-b-4 p-4 shadow-transparent">
            <p className="uppercase font-bold text-1xl">Sales Performance</p>
            <div className="LineChart-container">
              <LineGraph />
            </div>
          </div>
          <div className="bg-white rounded-lg border-b-4 p-4 shadow-transparent">
            <p className="uppercase font-bold text-1xl">Top Selling Products</p>
            <div className="BarChart-container">
              <HorizontalBarChart data={topSellingProductsData} />
            </div>
          </div>
        </div>

        {/* 2nd Row */}
        <div className="grid grid-cols-8 gap-4 mt-6">
          <div className="bg-white rounded-lg border-b-4 p-4 col-span-4 shadow-transparent">
            <p className="uppercase font-bold text-1xl">
              Traffic Visitor Sources
            </p>
            <div className="LineChart-container">
              <DoughnutChartCountries data={countryTrafficSourcesData2} />
            </div>
          </div>
          <div className="bg-white rounded-lg border-b-4 p-4 col-span-4 shadow-transparent">
            <p className="uppercase font-bold text-1xl">Sales Channel</p>
            <div>
              <DoughnutChartSalesChannel data={salesChannelData} />
            </div>
          </div>
        </div>

        {/* 3rd Row */}
        <div className="grid grid-cols-8 gap-4 mt-6">
          <div className="bg-white rounded-lg col-span-12 border-b-4 p-4 shadow-transparent">
            <p className="uppercase font-bold text-1xl">
              Traffic Coutry Sources Map
            </p>
            <div className="TopologyMap-container">
              <TopologyMap />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin1;
