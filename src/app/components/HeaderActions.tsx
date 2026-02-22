"use client";

import { useCart } from "@/app/components/CartProvider";
import { useCartDrawer } from "@/app/components/CartDrawerProvider";

const iconClasses = "h-5 w-5";

const HeaderActions = () => {
  const { totalItems } = useCart();
  const { openDrawer } = useCartDrawer();

  return (
    <div className="flex items-center gap-6">
      <button className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900">
        <svg
          viewBox="0 0 24 24"
          className={iconClasses}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <span>Stores</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900">
        <svg
          viewBox="0 0 24 24"
          className={iconClasses}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4 20a8 8 0 0 1 16 0" />
        </svg>
        <span>Profile</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900">
        <svg
          viewBox="0 0 24 24"
          className={iconClasses}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M20.8 7.6a4.6 4.6 0 0 0-8.1-2.7L12 5.7l-.7-.8a4.6 4.6 0 0 0-8.1 2.7c0 5 8.8 10.6 8.8 10.6s8.8-5.6 8.8-10.6z" />
        </svg>
        <span>Wishlist</span>
      </button>
      <button
        type="button"
        onClick={openDrawer}
        className="relative flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900"
      >
        <svg
          viewBox="0 0 24 24"
          className={iconClasses}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 7h12l-1 13H7z" />
          <path d="M9 7a3 3 0 1 1 6 0" />
        </svg>
        <span>Bag</span>
        {totalItems > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-amber-400 text-[10px] font-semibold text-white">
            {totalItems}
          </span>
        ) : null}
      </button>
    </div>
  );
};

export default HeaderActions;
