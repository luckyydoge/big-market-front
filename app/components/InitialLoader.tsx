// app/components/InitialDataLoader.tsx
'use client';

import { useEffect, useState, useCallback } from 'react'; // 引入 useCallback
import { useRouter, useSearchParams } from 'next/navigation';
import { queryUserActivityAccount } from "@/apis";

const apiHostUrl = process.env.API_HOST_URL ? process.env.API_HOST_URL : "https://console-mock.apipost.cn/mock/6afa907d-6678-45e2-b867-032a11090abd";

interface InitialDataLoaderProps {
    children: React.ReactNode;
}

export function InitialDataLoader({ children }: InitialDataLoaderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();

    // 使用 useCallback 包装异步函数，以确保它在依赖项变化时才重新创建
    const initializePage = useCallback(async () => {
        setIsLoading(true); // 每次初始化前都设为加载状态

        const currentParams = new URLSearchParams(searchParams.toString());
        let needsUrlUpdate = false; // 标记是否需要更新URL

        // 检查并设置 userId
        let userId = currentParams.get('userId');
        if (!userId) {
            userId = localStorage.getItem('userId');
            if (!userId) {
                userId = 'guest_' + Date.now().toString(36);
                localStorage.setItem('userId', userId);
            }
            currentParams.set('userId', userId);
            needsUrlUpdate = true;
        }

        // 检查并设置 activityId
        let activityId = currentParams.get('activityId');
        if (!activityId) {
            activityId = '100301'; // 默认值
            currentParams.set('activityId', activityId);
            needsUrlUpdate = true;
        }

        // 如果URL参数需要更新，则执行 router.replace
        if (needsUrlUpdate) {
            const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
            // 使用 router.replace，但在执行后设置一个状态来避免在本次渲染周期内重复触发
            // 或者更简单，让 useEffect 的依赖项来处理
            router.replace(newUrl);
            // 注意：router.replace 会导致组件重新渲染，并再次触发 useEffect
            // 所以，这里我们应该立即返回，让下一次 useEffect 运行来处理
            // 确保URL更新后的正确状态。
            return; // 提前返回，等待新的 URL 触发 useEffect 再次运行
        }

        // 只有当 URL 已经包含所需的参数时，才执行 API 调用
        // 否则，说明 URL 刚刚被更新，等待下一次 useEffect 运行
        if (currentParams.has('userId') && currentParams.has('activityId')) {
            try {
                // 执行异步 API 调用，并等待其完成
                await queryUserActivityAccount(String(currentParams.get('userId')), Number(currentParams.get('activityId')));
                fetch(`${apiHostUrl}/api/v1/raffle/activity/armory?activityId=${activityId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }})
                console.log("queryUserActivityAccount API 调用成功");
            } catch (error) {
                console.error("queryUserActivityAccount API 调用失败:", error);
                // 处理错误，例如显示错误信息或重定向
            } finally {
                setIsLoading(false); // API 调用完成后设置加载状态为 false
            }
        }

    }, [router, searchParams]); // 依赖项：router 和 searchParams

    useEffect(() => {
        // 在组件挂载时或者当 router 或 searchParams 变化时执行初始化
        initializePage();
    }, [initializePage]); // 依赖 useCallback 返回的 initializePage 函数

    if (isLoading) {
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading your content...</div>;
    }

    return <>{children}</>;
}
