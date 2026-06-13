import { SITE } from "../../config/site";

export function LoadingScreen({ isVisible }) {
  return (
    <div
      className={isVisible ? "loader" : "loader loader-hidden"}
      aria-hidden={!isVisible}
    >
      <div className="loader-mark" aria-hidden="true"><i /><i /><i /></div>
      <p>BUILDING THE SCENE</p>
      <p className="loader-credit">
        Created by <strong>{SITE.creator}</strong><span>Discord username</span>
      </p>
    </div>
  );
}
