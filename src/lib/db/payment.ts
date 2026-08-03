import "server-only";

const LS_API_KEY = process.env["LS_API_KEY"];
const LS_WEBHOOK_SIG = process.env["LS_WEBHOOK_SIG"];
const LS_REDIRECT_URL = process.env["LS_REDIRECT_URL"];
const DASHBOARD_URL = process.env["DASHBOARD_URL"];
const LS_STORE_ID = process.env["LS_STORE_ID"];
const LS_VARIANT_STANDARD_ID = process.env["LS_VARIANT_STANDARD_ID"];
const LEMON_SQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1";
const LEMON_SQUEEZY_HEADERS = {
    "Accept": "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    "Authorization": `Bearer ${LS_API_KEY}`,
};

export async function getSubscriptionURL(uid: string, userId: string, code: number): Promise<any | null> {
    if (!LS_API_KEY || !LS_STORE_ID || !LS_VARIANT_STANDARD_ID || !LS_REDIRECT_URL) {
        return null;
    }

    const response = await fetch(`${LEMON_SQUEEZY_API_URL}/checkouts`, {
        method: "POST",
        headers: LEMON_SQUEEZY_HEADERS,
        cache: 'no-store',
        body: JSON.stringify({
            data: {
                type: "checkouts",
                attributes: {
                    product_options: {
                        redirect_url: `${LS_REDIRECT_URL}?id=${userId}&code=${code}&time=${new Date().getTime()}`,
                    },
                    checkout_data: {
                        custom: {
                            authId: uid,
                            tier: 'Standard',
                        },
                    },
                },
                relationships: {
                    store: {
                        data: {
                            type: "stores",
                            id: LS_STORE_ID,
                        },
                    },
                    variant: {
                        data: {
                            type: "variants",
                            id: LS_VARIANT_STANDARD_ID,
                        },
                    },
                },
            },
        }),
    });

    if (!response.ok) {
        return null;
    }

    return (await response.json());
}

export async function cancelPaymentSubscription(id: string): Promise<any | null> {
    if (!LS_API_KEY || !LS_STORE_ID || !LS_VARIANT_STANDARD_ID || !LS_REDIRECT_URL) {
        return null;
    }
    const response = await fetch(`${LEMON_SQUEEZY_API_URL}/subscriptions/${id}`, {
        method: "DELETE",
        headers: LEMON_SQUEEZY_HEADERS,
        cache: 'no-store',
    });
    const result = await response.json();
    if (!response.ok) {
        console.log("cannot cancel", JSON.stringify(result));
        return null;
    }

    return true
}