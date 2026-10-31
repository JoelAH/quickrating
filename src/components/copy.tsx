"use client";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Copy({ link }: { link: string }) {
    const copyLink = async () => {
        try {
        await navigator.clipboard.writeText(link);
        toast.success("Link copied", {
            position: "top-right"
        });
        } catch { toast.error("Could not copy. Select the link and copy it manually."); }
    }

    return (
        <>
            <ToastContainer />
            <button type="button" aria-label="Copy page link" onClick={copyLink} style={{ border: 0, background: 'transparent', color: '#697954', cursor: 'pointer', padding: 5, display: 'inline-flex' }}>
                <ContentCopyIcon />
            </button>
        </>
    )
}