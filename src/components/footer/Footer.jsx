import Version from "../version/Version";
import "./footer.css";

const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="copyright pb-md-2">
        <p className="text-white">
          &copy; 2024{" "}
          <strong>
            <span>Manchiee De Coco Products. </span>
          </strong>
          All Rights Reserved <Version />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
