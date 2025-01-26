'use client';

import {MessageCard} from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { message } from "@/types/message";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const DashboardPage = () => {
    const [messages, setMessages] = useState<message[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const { toast } = useToast();
    const { data: session } = useSession();

    const form = useForm<z.infer<typeof acceptMessageSchema>>({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessage: false,
        },
    });

    const { register, watch, setValue } = form;
    const acceptMessage = watch("acceptMessage");

    const fetchAcceptMessages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/acceptMsg");
            setValue("acceptMessage", response.data.isAcceptingMessage);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: axiosError.response?.data?.message || "Error fetching accept messages",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/getMsg");
            setMessages(response.data.messages || []);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: axiosError.response?.data?.message || "Error fetching messages",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (!session?.user) return;
        fetchAcceptMessages();
        fetchMessages();
    }, [session, fetchAcceptMessages, fetchMessages]);

    const handleSwitchChange = async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.post<ApiResponse>("/api/acceptMsg", {
                acceptMessages: !acceptMessage,
            });
            setValue("acceptMessage", !acceptMessage);
            toast({
                title: response.data.message,
                variant: "default",
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: axiosError.response?.data?.message || "Error updating accept messages",
                variant: "destructive",
            });
        } finally {
            setIsSwitchLoading(false);
        }
    };

    const handleDeleteMessage = (messageId: number) => {
        setMessages((prev) => prev.filter((message) => message.id !== messageId));
    };

    const router = useRouter();
    // useEffect(() => {
    //     if (!session?.user) {
    //         router.push("/signin");
    //     }
    // }, [session, router]);

    

    const profileUrl = `${window.location.origin}/u/${session?.user.username}`;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: "URL Copied!",
            description: "Profile URL has been copied to clipboard.",
        });
    };

    return <div>

    
    {(!session?.user ) ? 
          <div className="flex flex-col items-center justify-center h-auto w-full mt-96">
            <h1>Not Logged In</h1>
            <Button onClick={() => router.push("/signin")}>Sign In</Button>
        </div> :
      (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered rounded-l  w-full p-4 mr-2"
                        aria-label="Profile URL"
                        title="Profile URL"
                    />
                    <Button onClick={copyToClipboard} className="p-6 hover:bg-gray-600 bg-gray-800 text-2xl ">📋</Button>
                </div>
            </div>
            <div className="mb-4">
                <Switch
                    {...register("acceptMessage")}
                    checked={acceptMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessage ? "On" : "Off"}
                </span>
            </div>
            <Separator />
            <Button className="mt-4" variant="outline" onClick={() => fetchMessages()}>
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <MessageCard
                            key={msg.id}
                            message={msg}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}
</div>
};

export default DashboardPage;
