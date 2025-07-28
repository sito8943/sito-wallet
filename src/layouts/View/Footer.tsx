import {useTranslation} from "react-i18next";

const year = new Date().getFullYear();

function Footer() {

    const {t} = useTranslation();

    return <footer className="w-full bg-base flex items-center justify-center">
        <p>{t("_pages:footer.copyright")} {year}</p>
    </footer>;
}

export default Footer;
