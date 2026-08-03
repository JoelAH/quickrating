"use client";

import { PageContact, SettingsMode } from "@/lib/models/client/page-setting";
import { isUsernameExist } from "@/lib/services/username";
import { Box, Grid, TextField, useMediaQuery } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Sketch } from '@uiw/react-color';
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

function SettingsFormSubmit({ onClientSubmit, submitLoading, classes }: { onClientSubmit: () => Promise<void>, submitLoading: boolean, classes: any }) {
    const { pending } = useFormStatus();
    return (
        <LoadingButton
            onClick={onClientSubmit}
            loading={submitLoading || pending}
            variant="contained"
            fullWidth
            className={classes.submitButton}
            sx={{
                height: '56px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#FBBC04',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                    backgroundColor: '#d18800'
                }
            }}
        >
            <span>Submit</span>
        </LoadingButton>
    )
}

const SettingsForm: React.FC<SettingsProps> = ({ mode, user }) => {
    const isMobile = useMediaQuery('(max-width:768px)');
    const [state, formAction] = useFormState(onServerSubmit, {});
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [usernameExists, setusernameExists] = useState<boolean>(false);
    const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
    const [hex, setHex] = useState(user?.themeColor || "#fbbc04");
    const formRef = useRef<HTMLFormElement>(null);
    const imageUrlRef = useRef<HTMLInputElement>(null);

    //image stuff
    const [cropperRef, setCropperRef] = useState<CropperRef | null>(null);
    const [image, setImage] = useState<ImageMode | null>(null);
    const previewRef = useRef<CropperPreviewRef>(null);


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
            }
        }
        setTimeout(() => {
            setSubmitLoading(false);
            formRef.current?.requestSubmit();
        }, 1000);
    }

    return (
        <Grid container spacing={2} sx={isMobile ? {} : { marginTop: 2 }}>
            <ToastContainer />
            <Grid item xs={12}>
                <form action={formAction} ref={formRef}>
                    <Box className={classes.boxControl}>
                        <h3>1. Enter Business Name<sup>*</sup></h3>
                        <TextField
                            defaultValue={user?.businessName || ''}
                            name="buisnessName"
                            variant="outlined"
                            placeholder="Your business name"
                            inputProps={{ maxLength: 100 }}
                            fullWidth
                            required />
                    </Box>
                    <Box className={classes.boxControl}>
                        <h3>2. What would you like your page link to look like? Enter a unique name.<sup>*</sup></h3>
                        <TextField
                            defaultValue={user?.customLink || ''}
                            label="quickrating.page/"
                            name="username"
                            variant="outlined"
                            inputProps={{ maxLength: 50 }}
                            InputLabelProps={{ required: false }}
                            fullWidth
                            onKeyUp={(e) => setUsername((e.target as HTMLInputElement)?.value || '')}
                            error={usernameExists || !isUsernameValid}
                            helperText={
                                ((mode === SettingsMode.Create && usernameExists) || !isUsernameValid) &&
                                <span>
                                    {
                                        mode === SettingsMode.Create && usernameExists && 'This username is already taken'
                                    }
                                    {
                                        !isUsernameValid && 'Use only alphanumeric characters (a-z and 0-9)'
                                    }
                                </span>
                            }
                            required />
                    </Box>
                    <Box className={classes.boxControl}>
                        <h3>3. Enter a custom greeting</h3>
                        <TextField
                            defaultValue={user?.greeting || ''}
                            name="greeting"
                            variant="outlined"
                            placeholder="Welcome to our review's page"
                            inputProps={{ maxLength: 100 }}
                            fullWidth />
                    </Box>
                    <Box className={classes.boxControl}>
                        <h3>4. Pick a color for your page&apos;s theme</h3>
                        <input name="color" type="hidden" value={hex} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <div className={classes.colorPickerContainer}>
                                    <Sketch
                                        color={hex}
                                        onChange={(color) => {
                                            setHex(color.hex);
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <div className={classes.colorChosen} style={{ backgroundColor: hex }}></div>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className={classes.boxControl}>
                        <h3>5. Upload your business&apos; logo</h3>
                        <input name="logoUrl" type="hidden" ref={imageUrlRef} />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <input type="file" accept="image/*" onChange={onLoadImage} />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Box sx={{ width: 300, height: 300, position: 'relative' }}>
                                    <Cropper
                                        className={classes.cropperBox}
                                        src={image && image.src}
                                        onUpdate={onImageUpdate}
                                        stencilComponent={CircleStencil}
                                        stencilProps={{
                                            aspectRatio: 1 / 1
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                {
                                    !!user?.imageUrl && !image?.src ?
                                        <img src={user?.imageUrl} className={classes.croppedImage} /> :
                                        <CropperPreview
                                            ref={previewRef}
                                            className={classes.croppedImage}
                                        />
                                }
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className={classes.boxControl}>
                        <h3>5. Add contact information (Optional)</h3>
                        <Grid container spacing={2}>
                            {
                                socialInputs.map(social => (
                                    <Grid key={social.name} container item xs={12} sx={{ alignItems: 'center' }}>
                                        <Grid item xs={1}>
                                            {social.icon}
                                        </Grid>
                                        <Grid item xs={11}>
                                            <TextField
                                                defaultValue={user?.contact?.[social.name as keyof PageContact] || ''}
                                                name={social.name}
                                                variant="outlined"
                                                label={social.label}
                                                inputProps={{ maxLength: 100 }}
                                                fullWidth />
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>
                    <Box className={classes.boxControl}>
                        <SettingsFormSubmit onClientSubmit={onClientSubmit} submitLoading={submitLoading} classes={classes} />
                    </Box>
                    {
                        state?.errors?.length > 0 && (
                            <Box sx={{ marginTop: 2 }}>
                                <ul>
                                    {state.errors.map((error: string) => <li key={error} className={classes.errorText}>{error}</li>)}
                                </ul>
                            </Box>
                        )
                    }
                </form>
            </Grid>
        </Grid>
    )
}

export default SettingsForm;