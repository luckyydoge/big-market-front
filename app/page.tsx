"use client";

import {LuckyWheelPage} from "@/app/pages/lucky/lucky-wheel-page";
import {LuckyGridPage} from "@/app/pages/lucky/lucky-grid-page";
import dynamic from "next/dynamic";
import {Suspense, useEffect, useState} from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {activityStrategyArmory, queryUserActivityAccount} from "@/apis";
import {InitialDataLoader} from "@/app/components/InitialLoader";


const StrategyArmoryButton = dynamic(async () => (await import("./components/StrategyArmory")).StrategyArmory)
const ActivityAccountButton = dynamic(async () => (await import("./components/ActivityAccount")).ActivityAccount)
const CalendarSignButton = dynamic(async () => (await import("./components/CalendarSign")).CalendarSign)
const StrategyRuleWeightButton = dynamic(async () => (await import("./components/StrategyRuleWeight")).StrategyRuleWeight)

export default function Home() {

    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        // const armory = async () => {
        //     const queryParams = new URLSearchParams(window.location.search);
        //     const activityId = Number(queryParams.get('activityId'));
        //     // if (!activityId) {
        //     //     window.alert("请在请求地址中，配置 activityId 值，如：http://localhost:3000/?activityId=100301")
        //     //     return;
        //     // }
        //     await activityStrategyArmory(activityId);
        //
        // }
        // armory()
    }, []);

    const handleRefresh = () => {
        setRefresh(refresh + 1)
    };

    return (
        <div>
            <Suspense fallback={<div>加载参数中...</div>}>
                <InitialDataLoader>
                    <div className="flex flex-col items-center justify-center min-h-screen bg-[#279050]"
                         style={{backgroundImage: "url('/background.svg')"}}>
                        {/* 头部文案 */}
                        <header className="text-7xl font-bold text-center text-gray-800 my-8" style={{color: "white"}}>
                            大营销平台 - 抽奖展示
                        </header>

                        <div className="flex items-center space-x-4">
                            {/* 装配抽奖 */}
                            <StrategyArmoryButton/>

                            {/* 账户额度 */}
                            <ActivityAccountButton refresh={refresh}/>

                            {/* 日历签到 */}
                            <CalendarSignButton handleRefresh={handleRefresh}/>
                        </div>

                        {/* 中间的两个div元素 */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg">
                                <div className="text-gray-700">
                                    <LuckyWheelPage handleRefresh={handleRefresh}/>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg">
                                <div className="text-gray-700">
                                    <LuckyGridPage handleRefresh={handleRefresh}/>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <StrategyRuleWeightButton refresh={refresh}/>
                        </div>


                    </div>
                </InitialDataLoader>
            </Suspense>
        </div>
    );


}



