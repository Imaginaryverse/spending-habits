import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { User } from "@supabase/supabase-js";
import { SpendingCategory, SpendingItem, UserProfile } from "@src/types";
import dayjs from "dayjs";

const FOO_BAR_BAZ = ["Foo", "Bar", "Baz", "Qux", "Quux", "Quuz", "Corge"];

const DEMO_USER: User = {
  id: "demo",
  aud: "authenticated",
  role: "authenticated",
  email: "demo@trackmacash.dev",
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
};

const DEMO_USER_PROFILE: UserProfile = {
  id: "demo",
  user_id: "demo",
  name: "Demo",
  monthly_spending_limit: 0,
};

const DEMO_CATEGORIES: SpendingCategory[] = [
  {
    id: 1,
    name: "Other",
    description: "",
  },
  {
    id: 2,
    name: "Food",
    description: "",
  },
  {
    id: 3,
    name: "Shopping",
    description: "",
  },
  {
    id: 4,
    name: "Commuting",
    description: "",
  },
  {
    id: 5,
    name: "Entertainment",
    description: "",
  },
  {
    id: 6,
    name: "Health",
    description: "",
  },
  {
    id: 7,
    name: "Groceries",
    description: "",
  },
];

type DemoContextType = {
  isDemo: boolean;
  setIsDemo: (payload: boolean) => void;
  demoUser: User;
  demoUserProfile: UserProfile;
  setDemoUserProfile: Dispatch<SetStateAction<UserProfile>>;
  demoCategories: SpendingCategory[];
  demoData: SpendingItem[];
  setDemoData: Dispatch<SetStateAction<SpendingItem[]>>;
};

export const DemoContext = createContext<DemoContextType>({
  isDemo: false,
  setIsDemo: () => {},
  demoUser: DEMO_USER,
  demoUserProfile: DEMO_USER_PROFILE,
  setDemoUserProfile: () => {},
  demoCategories: DEMO_CATEGORIES,
  demoData: [],
  setDemoData: () => {},
});

export function DemoProvider({ children }: PropsWithChildren) {
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [demoData, setDemoData] = useState<SpendingItem[]>([]);
  const [demoUserProfile, setDemoUserProfile] =
    useState<UserProfile>(DEMO_USER_PROFILE);

  useEffect(() => {
    if (!isDemo) {
      // reset state
      setDemoData([]);
      setDemoUserProfile(DEMO_USER_PROFILE);
    } else {
      setDemoData(generateDemoData());
    }
  }, [isDemo]);

  return (
    <DemoContext.Provider
      value={{
        isDemo,
        setIsDemo,
        demoUser: DEMO_USER,
        demoUserProfile,
        setDemoUserProfile,
        demoCategories: DEMO_CATEGORIES,
        demoData,
        setDemoData,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

function generateDemoData(): SpendingItem[] {
  const now = dayjs();
  const minHour = 6;
  const maxHour = 23;
  const currentHour = now.hour();
  const currentMinute = now.minute();
  const currentSecond = now.second();

  // generate 100 items, between from now to 3 months ago, some days have multiple items
  const data: SpendingItem[] = [];

  for (let i = 0; i < 100; i++) {
    const numItemsPerDay = Math.floor(Math.random() * 5) + 1;

    for (let j = 0; j < numItemsPerDay; j++) {
      const category =
        DEMO_CATEGORIES[Math.floor(Math.random() * DEMO_CATEGORIES.length)];

      // if at current day, only generate items up to current hour
      const isCurrentDay = i === 0;

      const randomHour = isCurrentDay
        ? Math.floor(Math.random() * currentHour) + minHour
        : Math.floor(Math.random() * (maxHour - minHour + 1) + minHour);
      const randomMinute = isCurrentDay
        ? Math.floor(Math.random() * currentMinute)
        : Math.floor(Math.random() * 60);
      const randomSecond = isCurrentDay
        ? Math.floor(Math.random() * currentSecond)
        : Math.floor(Math.random() * 60);

      const created_at = now
        .subtract(i, "day")
        .hour(randomHour)
        .minute(randomMinute)
        .second(randomSecond)
        .toDate();

      const item: SpendingItem = {
        id: crypto.randomUUID(),
        user_id: "demo",
        category_id: category.id,
        category_name: category.name,
        title: FOO_BAR_BAZ[Math.floor(Math.random() * FOO_BAR_BAZ.length)],
        comment: "",
        amount: Math.floor(Math.random() * 250) + 1,
        created_at,
      };

      data.push(item);
    }
  }

  return data;
}
