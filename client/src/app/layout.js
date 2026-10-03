import "./globals.css";


export const metadata = {
    title: "LinkUp",
    description: "Real-time messaging made simple",
};


export default function RootLayout({ children }) {
    return (
        <html lang="en">

            <body>
                {children}
            </body>

        </html>
    );
}