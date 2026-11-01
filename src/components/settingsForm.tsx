"use client";

import { PageContact, SettingsMode } from "@/lib/models/client/page-setting";
import { isUsernameExist } from "@/lib/services/username";
import { TextField } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import IconGrid from "./iconGrid";
import { CircleStencil, Cropper, CropperPreview, CropperPreviewRef, CropperRef } from 'react-advanced-cropper';
import "react-advanced-cropper/dist/style.css";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import classes from './settingsForm.module.scss';
import EmailIcon from '@mui/icons-material/Email';
import RoomIcon from '@mui/icons-material/Room';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LoadingButton from "@mui/lab/LoadingButton";
import { uploadFile } from "@/lib/firebase/image";
import { onServerSubmit } from "@/app/actions/settingsSubmit";
import { useFormState, useFormStatus } from "react-dom";
import { PAGE_BACKGROUNDS, getPageBackgroundStyle, normalizePageBackground } from "@/lib/pageBackgrounds";
import CONSTANTS from "@/lib/constants";
import { User } from "@/lib/models/client/user";

type SettingsProps = {
    mode: SettingsMode,
    user?: User
}

interface ImageMode {
    type?: string;
    src: string;
}

const socialInputs: { icon: any, label: string, name: string }[] = [
    { icon: <EmailIcon />, label: 'Business Email', name: 'mail' },
    { icon: <RoomIcon />, label: 'Address', name: 'address' },
    { icon: <LocalPhoneIcon />, label: 'Phone Number', name: 'phone' },
    { icon: <WhatsAppIcon />, label: 'Whatsapp', name: 'whatsapp' },
    { icon: <FacebookIcon />, label: 'Facebook URL', name: 'facebook' },
    { icon: <InstagramIcon />, label: 'Instagram URL', name: 'instagram' },
    { icon: <XIcon />, label: 'X URL', name: 'twitter' },
    { icon: <LinkedInIcon />, label: 'LinkedIn URL', name: 'linkedin' },
    { icon: <MusicNoteIcon />, label: 'TikTok URL', name: 'tiktok' }
];

function SettingsFormSubmit({ onClientSubmit, submitLoading, classes, isUpdate }: { onClientSubmit: () => Promise<void>, submitLoading: boolean, classes: any, isUpdate: boolean }) {
    const { pending } = useFormStatus();
    return (
        <LoadingButton
            onClick={onClientSubmit}
            loading={submitLoading || pending}
            variant="contained"
            className={classes.submitButton}
        >
            <span>{isUpdate ? 'Save changes' : 'Create my review page'} <span aria-hidden="true">↗</span></span>
        </LoadingButton>
    )
}

const SettingsForm: React.FC<SettingsProps> = ({ mode, user }) => {
    const [state, formAction] = useFormState(onServerSubmit, {});
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>(user?.customLink || "");
    const [draftName, setDraftName] = useState(user?.businessName || "");
    const [draftGreeting, setDraftGreeting] = useState(user?.greeting || "");
    const [draftContact, setDraftContact] = useState<PageContact>(() => ({ ...user?.contact }));
    const [usernameExists, setusernameExists] = useState<boolean>(false);
    const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
    const [pageBackground, setPageBackground] = useState(() => normalizePageBackground(user?.pageBackground));
    const [hex, setHex] = useState(user?.themeColor || "#fbbc04");
    const formRef = useRef<HTMLFormElement>(null);
    const imageUrlRef = useRef<HTMLInputElement>(null);

    //image stuff
    const [cropperRef, setCropperRef] = useState<CropperRef | null>(null);
    const [image, setImage] = useState<ImageMode | null>(null);
    const previewRef = useRef<CropperPreviewRef>(null);
    const sidebarPreviewRef = useRef<CropperPreviewRef>(null);


    useEffect(() => {
        if (username && !/^[a-zA-Z0-9]+$/.test(username)) {
            setIsUsernameValid(false);
        } else {
            setIsUsernameValid(true);
        }
        const getUsernameData = setTimeout(() => {
            isUsernameExist(username, mode === SettingsMode.Create ? true : false)
                .then(res => setusernameExists(res?.isExist || false))
                .catch(e => console.error(e))
        }, 3000)

        return () => clearTimeout(getUsernameData);
    }, [username, mode]);

    const onImageUpdate = (cropper: CropperRef) => {
        previewRef.current?.update(cropper);
        sidebarPreviewRef.current?.update(cropper);
        setCropperRef(cropper);
    };

    const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
        // Reference to the DOM input element
        const { files } = event.target;

        // Ensure that you have a file before attempting to read it
        if (files && files[0]) {
            // Create the blob link to the file to optimize performance:
            const blob = URL.createObjectURL(files[0]);

            // Get the image type from the extension. It's the simplest way, though be careful it can lead to an incorrect result:
            setImage({
                src: blob,
                type: files[0].type
            })
        }
        // Clear the event target value to give the possibility to upload the same image:
        event.target.value = '';
    };

    async function getImageBlob(): Promise<Blob | null> {
        const canvas = cropperRef?.getCanvas();
        if (canvas) {
            return new Promise(function (resolve, reject) {
                canvas.toBlob(function (blob) {
                    resolve(blob)
                })
            });
        }
        return null;
    }

    useEffect(() => {
        // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
        return () => {
            if (image && image.src) {
                URL.revokeObjectURL(image.src);
            }
        };
    }, [image]);

    useEffect(() => {
        if (state?.message) {
            toast.success(state.message, {
                position: "top-right"
            });
        }
    }, [state])

    async function onClientSubmit() {
        if (!formRef.current?.reportValidity() || !isUsernameValid || usernameExists) return;
        setSubmitLoading(true);
        const blob = await getImageBlob();

        if (blob) {
            try {
                const imgUrl = await uploadFile(blob);
                if (imgUrl && imageUrlRef.current) {
                    imageUrlRef.current.value = imgUrl;
                }
            }
            catch (e) {
                toast.error("Something went wrong while uploading image", {
                    position: "top-right"
                });
                setSubmitLoading(false);
                return;
            }
        }
        setTimeout(() => {
            setSubmitLoading(false);
            formRef.current?.requestSubmit();
        }, 1000);
    }

    return (
        <div className={classes.editor}>
            <form action={formAction} ref={formRef} className={classes.form}>
                <ToastContainer />
                <section className={classes.section}>
                    <div className={classes.sectionTitle}><span>01</span><div><h2>The essentials</h2><p>Introduce your business and choose a link to share.</p></div></div>
                    <div className={classes.boxControl}><TextField label="Business name" defaultValue={user?.businessName || ''} onChange={e => setDraftName(e.target.value)} name="buisnessName" inputProps={{ maxLength: 100 }} fullWidth required /></div>
                    <div className={classes.boxControl}><TextField label="Your page link" name="username" value={username} onChange={e => setUsername(e.target.value)} inputProps={{ maxLength: 50 }} fullWidth required error={usernameExists || !isUsernameValid} helperText={!isUsernameValid ? 'Use letters and numbers only.' : usernameExists ? 'This page link is already taken.' : `quickrating.page/${username || 'yourbusiness'}`} /></div>
                    <div className={classes.boxControl}><TextField label="Welcome message (optional)" name="greeting" defaultValue={user?.greeting || ''} onChange={e => setDraftGreeting(e.target.value)} placeholder="A few words to welcome your customers" inputProps={{ maxLength: 100 }} fullWidth /></div>
                </section>
                <section className={classes.section}>
                    <div className={classes.sectionTitle}><span>02</span><div><h2>A little personality</h2><p>Bring your brand colors, background, and logo along.</p></div></div>
                    <div className={classes.colorRow}><input id="theme-color" type="color" value={hex} onChange={e => setHex(e.target.value)} /><div><label htmlFor="theme-color">Brand color</label><p>{hex.toUpperCase()} · Used for accents and buttons</p></div><input name="color" type="hidden" value={hex} /></div>
                    <fieldset className={classes.backgroundPicker}>
                        <legend>Page background</legend>
                        <p>Set the mood around your page. Your brand color stays yours.</p>
                        <div className={classes.backgroundOptions}>
                            {PAGE_BACKGROUNDS.map(background => (
                                <label key={background.id} className={classes.backgroundOption}>
                                    <input type="radio" name="pageBackground" value={background.id} checked={pageBackground === background.id} onChange={() => setPageBackground(background.id)} />
                                    <span className={classes.backgroundSample} style={background.style} aria-hidden="true"><span style={{ borderTopColor: hex }} /><span className={classes.selectionMark}>✓</span></span>
                                    <span className={classes.backgroundName}>{background.label}</span>
                                    <span className={classes.backgroundDescription}>{background.description}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <div className={classes.logoUpload}>
                        <label htmlFor="business-logo">Business logo <span>Optional</span></label>
                        {user?.imageUrl && !image && (
                            <div className={classes.existingLogo}>
                                <Image src={user.imageUrl} alt="Current business logo" width={72} height={72} unoptimized className={classes.savedLogo} />
                                <div><strong>Your current logo</strong><p>Choose a new image to replace it, or keep this one.</p></div>
                            </div>
                        )}
                        <p>A square image works best. Adjust the crop after choosing a file.</p>
                        <input id="business-logo" type="file" accept="image/*" onChange={onLoadImage} />
                        <input name="logoUrl" type="hidden" ref={imageUrlRef} defaultValue={user?.imageUrl || ''} />
                    </div>
                    {image && <div className={classes.cropLayout}><div><Cropper className={classes.cropperBox} src={image.src} onUpdate={onImageUpdate} stencilComponent={CircleStencil} stencilProps={{ aspectRatio: 1 }} /></div><CropperPreview ref={previewRef} className={classes.croppedImage} /></div>}
                </section>
                <section className={classes.section}>
                    <div className={classes.sectionTitle}><span>03</span><div><h2>Keep the conversation going</h2><p>All optional. Add the places your customers can find you.</p></div></div>
                    <div className={classes.contactFields}>{socialInputs.map(social => <div key={social.name} className={classes.boxControl}><TextField value={draftContact[social.name as keyof PageContact] || ''} onChange={event => setDraftContact(current => ({ ...current, [social.name]: event.target.value }))} name={social.name} label={social.label} inputProps={{ maxLength: 100 }} InputProps={{ startAdornment: <span className={classes.fieldIcon}>{social.icon}</span> }} fullWidth /></div>)}</div>
                </section>
                {state?.errors?.length > 0 && <div className={classes.errorBox} role="alert"><strong>A few details need your attention.</strong><ul>{state.errors.map((error: string) => <li key={error}>{error}</li>)}</ul></div>}
                <div className={classes.saveBar}><p>{mode === SettingsMode.Create ? `Ready when you are. Your first ${CONSTANTS.freeReviewLimit} reviews are free.` : 'Changes appear on your public page after saving.'}</p><SettingsFormSubmit onClientSubmit={onClientSubmit} submitLoading={submitLoading} classes={classes} isUpdate={mode === SettingsMode.Update} /></div>
            </form>
            <aside className={classes.preview}>
                <p className={classes.previewLabel}>A LITTLE PREVIEW</p>
                <div className={classes.previewCanvas} style={getPageBackgroundStyle(pageBackground)} data-background={pageBackground}>
                <div className={classes.previewCard}>
                    <div className={classes.previewAccent} style={{ backgroundColor: hex }} />
                    <div className={classes.previewBody}>
                        {image ? (
                            <CropperPreview ref={sidebarPreviewRef} className={classes.previewLogo} />
                        ) : user?.imageUrl ? (
                            <Image src={user.imageUrl} alt="Your business logo" width={67} height={67} unoptimized className={classes.previewLogo} style={{ borderColor: hex }} />
                        ) : (
                            <div className={classes.previewInitial} style={{ borderColor: hex }}>{draftName.trim().charAt(0).toUpperCase() || '✦'}</div>
                        )}
                        <h3>{draftName || 'Your business name'}</h3>
                        <p>{draftGreeting || 'Your customer stories start here.'}</p>
                        {draftContact.address?.trim() && <p className={classes.previewAddress}><RoomIcon aria-hidden="true" />{draftContact.address}</p>}
                        <div className={classes.previewContacts}><IconGrid biz={{ contact: draftContact }} /></div>
                        <div className={classes.previewReview}><span aria-label="5 stars">★★★★★</span><p>“A kind word from a happy customer could live right here.”</p><small>Illustrative testimonial</small></div>
                    </div>
                    <div className={classes.previewUrl}>quickrating.page/{username || 'yourbusiness'}</div>
                </div>
                </div>
                <p className={classes.previewNote}>Your brand. Their words.<br />One simple link to share.</p>
                <Link href="/demo/review-page">Explore an example page ↗</Link>
            </aside>
        </div>
    );
}

export default SettingsForm;
