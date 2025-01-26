import { message } from "./message";

// interface Message{
//     content: string;
//     createdAt: Date
// }


export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<message>

}
