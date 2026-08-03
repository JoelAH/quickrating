"use client";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Copy({ link }: { link: string }) {
    const copyLink = () => {
        navigator.clipboard.writeText(link);
        toast.success("Link copied", {
            position: "top-right"
        });
    }

    return (
        <>
            <ToastContainer />
            <span onClick={copyLink}>
                <ContentCopyIcon />
            </span>
        </>
    )
}