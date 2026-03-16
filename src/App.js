import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Send, BarChart3, ClipboardList, Clock, User, Download, Crosshair, Trash2, Lock, Eye, Radio, Database, Save, Package, Search, UserPlus, Users, Tags } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

// --- Firebase Initialization ---
const firebaseConfig = {
  apiKey: "AIzaSyAZElN2h42rH5bZIJj4FKhRoK88dDkQR88",
  authDomain: "levanon-d18b8.firebaseapp.com",
  projectId: "levanon-d18b8",
  storageBucket: "levanon-d18b8.firebasestorage.app",
  messagingSenderId: "479920656987",
  appId: "1:479920656987:web:c08899653f063d1d52a57e"
};

const finalConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : firebaseConfig;
const app = initializeApp(finalConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'master-form-app';

const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz8L2Lg3k5yS_lzU-FTZ6lTLsWKV2_44PQpSxIV_iIErXiMCVhjk119Z0_ZC5TGekeZ/exec';

const DEFAULT_SOLDIERS_LIST = [
  { name: 'סרגי סטבצ׳אנסקי', id: '5378690', department: '' },
  { name: 'אוהד קאזס', id: '6081946', department: '' },
  { name: 'ידידיה המבורגר', id: '8548547', department: '' },
  { name: 'ינון מזרחי', id: '8070579', department: '' },
  { name: 'ידיד חפר', id: '7290989', department: '' },
  { name: 'דניאל שצן', id: '5672643', department: '' },
  { name: 'איתמר הרוש', id: '8079178', department: '' },
  { name: 'ברק דרורי', id: '5912854', department: '' },
  { name: 'יואב כהנא', id: '5394822', department: '' },
  { name: 'ברק פוקס', id: '5913616', department: '' },
  { name: 'אריאל צבי טרינק', id: '5608407', department: '' },
  { name: 'אביחי אלכסנדר מאיר', id: '5405058', department: '' },
  { name: 'ניסים קדוש', id: '7224013', department: '' },
  { name: 'אפרים בן-שחר', id: '7139444', department: '' },
  { name: 'אלירן גבאי', id: '8183419', department: '' },
  { name: 'יוסף שגב', id: '8386926', department: '' },
  { name: 'אלמוג שפיגל', id: '8184619', department: '' },
  { name: 'יהונתן פלג', id: '8183541', department: '' },
  { name: 'אורי אראמבאם', id: '8179879', department: '' },
  { name: 'תומר תורג׳מן', id: '8194914', department: '' },
  { name: 'מלאכי כהן', id: '8144838', department: '' },
  { name: 'יצחק בן הרוש', id: '8085153', department: '' },
  { name: 'אפרים מרקוביץ', id: '8180275', department: '' },
  { name: 'אברהם אשכנזי', id: '8111246', department: '' },
  { name: 'אורי קרוק', id: '8191629', department: '' },
  { name: 'אופיר אהרונוב', id: '8121441', department: '' },
  { name: 'אוהד אפשטיין', id: '8144726', department: '' },
  { name: 'ידידיה בכר', id: '8194853', department: '' },
  { name: 'איתמר יחזקאל', id: '8133487', department: '' },
  { name: 'עידו סגל', id: '8251169', department: '' },
  { name: 'אריאל ברדה', id: '8610370', department: '' },
  { name: 'דביר אליהו', id: '8123102', department: '' },
  { name: 'עוז בני כץ', id: '8167708', department: '' },
  { name: 'דוד ויינברג', id: '', department: '' },
  { name: 'עובדיה רוזנצויג', id: '7128385', department: '' },
  { name: 'אליצור המבורגר', id: '7658146', department: '' },
  { name: 'ליאור המבורגר', id: '7277662', department: '' },
  { name: 'ישי המבורגר', id: '5944561', department: '' },
  { name: 'אופיר אידן', id: '8071206', department: '' },
  { name: 'אברהם רבינוביץ', id: '5366430', department: '' },
  { name: 'גיל בשן', id: '6131108', department: '' },
  { name: 'מאיר בן לולו', id: '8119666', department: '' },
  { name: 'שמואל פריד', id: '5927853', department: '' },
  { name: 'ברוך יואל', id: '5925528', department: '' },
  { name: 'עתיר אמר', id: '8010141', department: '' },
  { name: 'חנוך הורן', id: '5935189', department: '' },
  { name: 'עומר פרטר', id: '7447211', department: '' },
  { name: 'נריה גיאת', id: '5343999', department: '' },
  { name: 'רותם רוה', id: '8479348', department: '' },
  { name: 'עמית צרציס', id: '8885838', department: '' },
  { name: 'יואב סרולוביץ׳', id: '8887517', department: '' },
  { name: 'אביב אסף', id: '9097195', department: '' },
  { name: 'איתי פיצוטו', id: '8863746', department: '' },
  { name: 'איתן גל מלכה', id: '9058197', department: '' },
  { name: 'גפן קליר', id: '9088299', department: '' },
  { name: 'יהודה עדרי', id: '9022721', department: '' },
  { name: 'מתן משה שגיא', id: '9167271', department: '' },
  { name: 'נועם ויזמן', id: '9170184', department: '' },
  { name: 'ניר בר אל', id: '9066947', department: '' },
  { name: 'סולומון בוקעי סעדיה', id: '9445017', department: '' },
  { name: 'עומר בוגנים', id: '9136316', department: '' },
  { name: 'עומר קריב', id: '8762559', department: '' },
  { name: 'עילי בן שושן', id: '9147944', department: '' },
  { name: 'יואב ספיר', id: '9010513', department: '' },
  { name: 'עמרי גרמן', id: '8804021', department: '' },
  { name: 'רועי גליק', id: '9114930', department: '' },
  { name: 'רותם מוגילנר', id: '8888025', department: '' },
  { name: 'רותם שגיא', id: '8863623', department: '' },
  { name: 'שחר בונפיל', id: '9149088', department: '' },
  { name: 'נמרובסקי', id: '9149912', department: '' },
  { name: 'תומר קוקס', id: '8742547', department: '' },
  { name: 'נדב נוימן', id: '9077447', department: '' },
  { name: 'אלכס קובטונוב', id: '9084168', department: '' },
  { name: 'דן יוסף מלכה', id: '8899719', department: '' },
  { name: 'רוי אביתר יוסף', id: '9004235', department: '' },
  { name: 'אורי קרגולה', id: '8576955', department: '' },
  { name: 'ניתאי קסטוריאנו', id: '8845318', department: '' },
  { name: 'אחיה רואש', id: '8011443', department: '' },
  { name: 'טל יוחנן', id: '7647018', department: '' },
  { name: 'שלמה דסה', id: '7558030', department: '' },
  { name: 'יוסף סומר', id: '5431831', department: '' },
  { name: 'אופיר', id: '9004766', department: '' },
  { name: 'אדיסו טגניה', id: '8383428', department: '' },
  { name: 'אדיר קלימי', id: '8731005', department: '' },
  { name: 'יובל בראל', id: '8055112', department: '' },
  { name: 'הילה הררי', id: '8759382', department: '' },
  { name: 'סייג', id: '9003600', department: '' },
  { name: 'נריה אלון', id: '7568427', department: '' },
  { name: 'ערן הלאלי', id: '8317385', department: '' },
  { name: 'רותם יורה', id: '9004300', department: '' },
  { name: 'רועי לזר', id: '9094355', department: '' },
  { name: 'סתיו קדם פור', id: '8773077', department: '' },
  { name: 'אלון ליבוביץ', id: '8851145', department: '' },
  { name: 'אלעד שוק', id: '9082727', department: '' },
  { name: 'איציק אנג׳ל', id: '7674574', department: 'מפל״ג', isMaplag: true },
  { name: 'ניר שמאי', id: '8740532', department: 'מפל״ג', isMaplag: true },
  { name: 'איתי ונטורה', id: '6114305', department: 'מפל״ג', isMaplag: true },
  { name: 'יצחק אברמן', id: '7216186', department: 'מפל״ג', isMaplag: true },
  { name: 'אורי קלרפלד', id: '8131857', department: 'מפל״ג', isMaplag: true },
  { name: 'רסים אטקשייב', id: '7116464', department: 'מפל״ג', isMaplag: true },
  { name: 'גל יעבץ', id: '5977857', department: 'מפל״ג', isMaplag: true }
];

const DEFAULT_INVENTORY_CATEGORIES = {
  'ציוד לחימה ומיגון': [
    'מנשא 90 ליטר', 'ווסט לוחם', 'ווסט נגב', 'ווסט מטול', 'ווסט חובש', 'קסדת שחר',
    'מצנפת קסדה', 'רשת הסוואה אישית', 'לוח קרמי קדמי',
    'לוח קרמי אחורי', 'ברכיות פלסטיק',
    'משקפי מגן שומר אחי'
  ],
  'עזרים וחלקי נשק': [
    'רצועת נשיאה משופרת לנק״ל', 'מחסנית מתכת ל מ-16', 'צולבת למחסנית ל מ-16',
    'חוטר ל מ-16', 'מברשת ניקוי לנק״ל', 'נרתיק לערכת ניקוי', 'ערכת ניקוי נגב/מאג',
    'יראור'
  ],
  'ציוד שהייה וכללי': [
    'שקית שתייה 3 ליטר', 'חלפ״ס עליון', 'חלפ״ס תחתון', 'תחבושת אישית אלסטית', 'מזרון שטח מתנפח',
    'שק שינה', 'שק חפצים'
  ],
  'ביגוד עבודה': [
    'כובע עבודה', 'חגורת עבודה', 'חולצת עבודה', 'מכנס עבודה'
  ]
};

const DEFAULT_WEAPONS_DATA = {
  'מא״ג': ['6700619', '6800487', '6701297', '6203175'],
  'מיקרו תבור ד׳ קלעים': ['47870617', '47881110', '47882848', '47870780', '47880683', '47883100', '47886017', '47881112'],
  'נגב': ['48100376', '47520436', '41510331', '48100370', '47520378', '45510326', '40510132', '41510056', '47520366'],
  'M16': ['1918639', '4399678', '9419878', '1809026', '5626331', '5014846', '9164128', '9417439', '3406011', '3460928', '4354945', '5149954', '9261088', '9596808'],
  'M203 (צ. מטול)': ['9175237 (מטול 42949)', '550680 (מטול 100534)', '5149525 (מטול 11282)', '9190798 (מטול 11271)', '5122685 (מט01 10713)', '9203350 (מטול 11279)'],
  'M4': ['751651', '129673', '228655', '426775', '228122', '279977', '228844', '753420', '757607', '9254825', '4031403', '5032177', '5259529', '9189203', '4983510', '9189785', '475733', '9205919', '756945', '707891', '9184364', '617447', '228161', '427436', '616950', '473261', '6269470', '9241215'],
  'M4 קלע': ['6318322', '6317951']
};

const DEFAULT_OPTICS_DATA = {
  'משקפת 10x50': ['715763', '716041', '715539', '716073', '716063', '716026', '715989', '715808'],
  'משקפת 8x30': ['302739', '302777'],
  'ליאור': ['180260', '85033', '31050101', '96115', '96537', '96821', '97316', '98010', '96803', '160089'],
  'שח״ע': ['7094943', '7094921', '7094949', '10050283', '4010381', '96010192', '7094950'],
  'עכבר': ['70000045', '772246', '10055265', '10055148', '122179'],
  'כוונת טריג׳יקון': ['100083426', '955206', '956113', '955502', '955923', '955122', '956719', '957347', '957307', '956447'],
  'מיקרון': ['230749', '230760', '230753'],
  'עידו': ['4140', '4157'],
  'זאבון': ['ללא מספר סידורי'],
  'כוונת M5': ['ללא מספר סידורי'],
  'מפרומור': ['ללא מספר סידורי'],
  'ציין לייזר': ['ללא מספר סידורי']
};

const DEFAULT_COMMS_DATA = {
  'קשר 710': ['ללא מספר סידורי'],
  'טלפון אדום': ['ללא מספר סידורי'],
  'רחפן איוו': ['ללא מספר סידורי'],
  'אולר': ['ללא מספר סידורי']
};

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('form');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInAdmin, setLoggedInAdmin] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [soldierName, setSoldierName] = useState('');
  const [personalNumber, setPersonalNumber] = useState('');

  const [formSearchTerm, setFormSearchTerm] = useState('');
  const [isFormDropdownOpen, setIsFormDropdownOpen] = useState(false);
  const [dashboardSearchTerm, setDashboardSearchTerm] = useState('');
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);

  const [inventoryCategories, setInventoryCategories] = useState(DEFAULT_INVENTORY_CATEGORIES);
  const [weaponsData, setWeaponsData] = useState(DEFAULT_WEAPONS_DATA);
  const [opticsData, setOpticsData] = useState(DEFAULT_OPTICS_DATA);
  const [commsData, setCommsData] = useState(DEFAULT_COMMS_DATA);
  const [totalStock, setTotalStock] = useState({});
  const [soldiersData, setSoldiersData] = useState(DEFAULT_SOLDIERS_LIST);

  const [isSavingCategories, setIsSavingCategories] = useState(false);
  const [categoriesSaveMessage, setCategoriesSaveMessage] = useState('');

  const [isSavingDb, setIsSavingDb] = useState(false);
  const [dbSaveMessage, setDbSaveMessage] = useState('');

  const [isSavingStock, setIsSavingStock] = useState(false);
  const [stockSaveMessage, setStockSaveMessage] = useState('');

  const [isSavingSoldiers, setIsSavingSoldiers] = useState(false);
  const [soldierSaveMessage, setSoldierSaveMessage] = useState('');
  const [newSoldier, setNewSoldier] = useState({ name: '', id: '', department: '', isMaplag: false });

  const [cart, setCart] = useState({});
  const [originalCart, setOriginalCart] = useState({});

  const [selectedWeaponType, setSelectedWeaponType] = useState('');
  const [selectedWeaponSerial, setSelectedWeaponSerial] = useState('');
  const [cartWeapons, setCartWeapons] = useState([]);
  const [originalWeapons, setOriginalWeapons] = useState([]);

  const [selectedOpticType, setSelectedOpticType] = useState('');
  const [selectedOpticSerial, setSelectedOpticSerial] = useState('');
  const [cartOptics, setCartOptics] = useState([]);
  const [originalOptics, setOriginalOptics] = useState([]);

  const [selectedCommType, setSelectedCommType] = useState('');
  const [selectedCommSerial, setSelectedCommSerial] = useState('');
  const [cartComms, setCartComms] = useState([]);
  const [originalComms, setOriginalComms] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const [selectedSoldier, setSelectedSoldier] = useState('');
  const [inventoryTotals, setInventoryTotals] = useState({});
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'inventory_requests');
    const unsubscribeRequests = onSnapshot(requestsRef, (snapshot) => {
      const history = [];
      const totals = {};

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        history.push({ id: docSnap.id, ...data });

        if (data.items) {
          Object.entries(data.items).forEach(([itemName, quantity]) => {
            const qty = Number(quantity);
            totals[itemName] = (totals[itemName] || 0) + qty;
          });
        }
      });

      Object.keys(totals).forEach(k => {
        if (totals[k] <= 0) delete totals[k];
      });

      history.sort((a, b) => {
        const timeA = a.timestamp?.toMillis() || 0;
        const timeB = b.timestamp?.toMillis() || 0;
        return timeB - timeA;
      });

      setSubmissionHistory(history);
      setInventoryTotals(totals);
      setIsLoadingData(false);
    }, (error) => {
      console.error("Error fetching data:", error);
      setIsLoadingData(false);
    });

    const settingsRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory_settings', 'master_lists');
    const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.categories) setInventoryCategories(data.categories);
        if (data.weapons) setWeaponsData(data.weapons);
        if (data.optics) setOpticsData(data.optics);
        if (data.comms) setCommsData(data.comms);
        if (data.totalStock) setTotalStock(data.totalStock);
        if (data.soldiers) setSoldiersData(data.soldiers);
      }
    }, (error) => console.error("Error fetching settings:", error));

    return () => {
      unsubscribeRequests();
      unsubscribeSettings();
    };
  }, [user]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const username = loginUsername.trim();
    const password = loginPassword.trim();

    if (!username || !password) {
      setLoginError('יש להזין שם פרטי ומספר אישי');
      return;
    }

    const soldier = soldiersData.find(s =>
        s.name.includes(username) &&
        s.id === password &&
        password !== ''
    );

    if (soldier) {
      if (soldier.isMaplag) {
        setLoggedInAdmin(soldier.name);
        setIsAuthenticated(true);
      } else {
        setLoginError('גישה נדחתה: המערכת מורשית לחיילי מפל״ג בלבד.');
      }
    } else {
      setLoginError('שם המשתמש או הסיסמה שגויים');
    }
  };

  const handleSaveDatabase = async () => {
    setIsSavingDb(true);
    try {
      const cleanDataObj = (dataObj) => {
        const cleaned = {};
        Object.keys(dataObj).forEach(key => {
          cleaned[key] = dataObj[key].map(s => s.trim()).filter(s => s !== '');
        });
        return cleaned;
      };

      const cleanedWeapons = cleanDataObj(weaponsData);
      const cleanedOptics = cleanDataObj(opticsData);
      const cleanedComms = cleanDataObj(commsData);

      const settingsRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory_settings', 'master_lists');
      await setDoc(settingsRef, {
        weapons: cleanedWeapons,
        optics: cleanedOptics,
        comms: cleanedComms
      }, { merge: true });

      setWeaponsData(cleanedWeapons);
      setOpticsData(cleanedOptics);
      setCommsData(cleanedComms);

      setDbSaveMessage('מסד הנתונים נשמר וסונכרן בהצלחה!');
    } catch (e) {
      console.error(e);
      setDbSaveMessage('שגיאה בשמירת מסד הנתונים.');
    } finally {
      setIsSavingDb(false);
      setTimeout(() => setDbSaveMessage(''), 4000);
    }
  };

  const handleSaveStock = async () => {
    setIsSavingStock(true);
    try {
      const settingsRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory_settings', 'master_lists');
      await setDoc(settingsRef, { totalStock: totalStock }, { merge: true });
      setStockSaveMessage('המלאי הכללי נשמר בהצלחה!');
    } catch (error) {
      console.error(error);
      setStockSaveMessage('שגיאה בשמירת המלאי.');
    } finally {
      setIsSavingStock(false);
      setTimeout(() => setStockSaveMessage(''), 4000);
    }
  };

  const handleSaveSoldiers = async () => {
    setIsSavingSoldiers(true);
    try {
      const settingsRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory_settings', 'master_lists');
      await setDoc(settingsRef, { soldiers: soldiersData }, { merge: true });
      setSoldierSaveMessage('רשימת החיילים נשמרה בהצלחה!');
    } catch (error) {
      console.error(error);
      setSoldierSaveMessage('שגיאה בשמירת רשימת החיילים.');
    } finally {
      setIsSavingSoldiers(false);
      setTimeout(() => setSoldierSaveMessage(''), 4000);
    }
  };

  const handleSaveCategories = async () => {
    setIsSavingCategories(true);
    try {
      const cleanDataObj = (dataObj) => {
        const cleaned = {};
        Object.keys(dataObj).forEach(key => {
          cleaned[key] = dataObj[key].map(s => s.trim()).filter(s => s !== '');
        });
        return cleaned;
      };

      const cleanedCategories = cleanDataObj(inventoryCategories);
      const settingsRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory_settings', 'master_lists');
      await setDoc(settingsRef, { categories: cleanedCategories }, { merge: true });

      setInventoryCategories(cleanedCategories);
      setCategoriesSaveMessage('סוגי הפריטים נשמרו בהצלחה!');
    } catch (error) {
      console.error(error);
      setCategoriesSaveMessage('שגיאה בשמירת סוגי הפריטים.');
    } finally {
      setIsSavingCategories(false);
      setTimeout(() => setCategoriesSaveMessage(''), 4000);
    }
  };

  const handleAddSoldier = (e) => {
    e.preventDefault();
    if (newSoldier.name && newSoldier.id) {
      setSoldiersData([...soldiersData, newSoldier]);
      setNewSoldier({ name: '', id: '', department: '', isMaplag: false });
    }
  };

  const handleUpdateSoldier = (index, field, value) => {
    const updatedSoldiers = [...soldiersData];
    updatedSoldiers[index] = { ...updatedSoldiers[index], [field]: value };
    setSoldiersData(updatedSoldiers);
  };

  const handleRemoveSoldier = (index) => {
    const updatedSoldiers = soldiersData.filter((_, i) => i !== index);
    setSoldiersData(updatedSoldiers);
  };

  const selectSoldierForForm = (soldier) => {
    if (!soldier) {
      setSoldierName('');
      setPersonalNumber('');
      setCart({}); setOriginalCart({});
      setCartWeapons([]); setOriginalWeapons([]);
      setCartOptics([]); setOriginalOptics([]);
      setCartComms([]); setOriginalComms([]);
      return;
    }

    setSoldierName(soldier.name);
    setPersonalNumber(soldier.id);
    const depStr = soldier.department ? ` | ${soldier.department}` : '';
    setFormSearchTerm(`${soldier.name} - ${soldier.id}${depStr}`);
    setIsFormDropdownOpen(false);

    const soldierHistory = [...submissionHistory]
        .filter(entry => entry.soldierName === soldier.name)
        .reverse();

    const currentCart = {};
    const currentWeaponsMap = new Map();
    const currentOpticsMap = new Map();
    const currentCommsMap = new Map();

    soldierHistory.forEach(entry => {
      if (entry.items) {
        Object.entries(entry.items).forEach(([item, qty]) => {
          currentCart[item] = (currentCart[item] || 0) + Number(qty);
        });
      }
      if (entry.weapons) {
        entry.weapons.forEach(w => currentWeaponsMap.set(`${w.type}-${w.serial}`, w));
      }
      if (entry.returnedWeapons) {
        entry.returnedWeapons.forEach(w => currentWeaponsMap.delete(`${w.type}-${w.serial}`));
      }
      if (entry.optics) {
        entry.optics.forEach(o => currentOpticsMap.set(`${o.type}-${o.serial}`, o));
      }
      if (entry.returnedOptics) {
        entry.returnedOptics.forEach(o => currentOpticsMap.delete(`${o.type}-${o.serial}`));
      }
      if (entry.comms) {
        entry.comms.forEach(c => currentCommsMap.set(`${c.type}-${c.serial}`, c));
      }
      if (entry.returnedComms) {
        entry.returnedComms.forEach(c => currentCommsMap.delete(`${c.type}-${c.serial}`));
      }
    });

    Object.keys(currentCart).forEach(k => {
      if (currentCart[k] <= 0) delete currentCart[k];
    });

    setCart({...currentCart});
    setOriginalCart({...currentCart});
    setCartWeapons(Array.from(currentWeaponsMap.values()));
    setOriginalWeapons(Array.from(currentWeaponsMap.values()));
    setCartOptics(Array.from(currentOpticsMap.values()));
    setOriginalOptics(Array.from(currentOpticsMap.values()));
    setCartComms(Array.from(currentCommsMap.values()));
    setOriginalComms(Array.from(currentCommsMap.values()));
  };

  const selectSoldierForDashboard = (soldier) => {
    if (!soldier) {
      setSelectedSoldier('');
      setDashboardSearchTerm('');
      return;
    }
    setSelectedSoldier(soldier.name);
    const depStr = soldier.department ? ` | ${soldier.department}` : '';
    setDashboardSearchTerm(`${soldier.name} - ${soldier.id}${depStr}`);
    setIsDashboardDropdownOpen(false);
  };

  const renderDbEditor = (data, setData, title, icon) => {
    const handleTextChange = (type, value) => {
      const newArray = value.split('\n');
      setData(prev => ({...prev, [type]: newArray}));
    };
    const handleAddType = (e) => {
      e.preventDefault();
      const newType = e.target.newType.value.trim();
      if (newType && !data[newType]) {
        setData(prev => ({...prev, [newType]: []}));
        e.target.reset();
      }
    };
    const handleDeleteType = (type) => {
      const newData = {...data};
      delete newData[type];
      setData(newData);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-4">
            {icon} <span className="mr-2">{title}</span>
          </h2>
          <div className="space-y-4">
            {Object.keys(data).map(type => (
                <div key={type} className="border border-slate-200 rounded-lg p-3 bg-slate-50 relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800">{type}</span>
                    <button
                        onClick={() => handleDeleteType(type)}
                        className="text-red-500 hover:text-red-700 p-1 bg-white rounded shadow-sm border border-red-100"
                        title="מחק קטגוריה זו"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                      className="w-full border border-slate-300 rounded p-2 text-sm text-right bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      rows="3"
                      placeholder="הזן מספרים סידוריים מופרדים בשורות חדשות (אנטר)"
                      value={(data[type] || []).join('\n')}
                      onChange={(e) => handleTextChange(type, e.target.value)}
                  />
                </div>
            ))}
          </div>
          <form onSubmit={handleAddType} className="mt-4 flex gap-2">
            <input
                name="newType"
                placeholder={`הוסף סוג חדש ל${title}...`}
                className="flex-1 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button type="submit" className="bg-slate-800 hover:bg-slate-900 transition-colors text-white px-4 py-2 rounded-lg text-sm font-bold">
              הוסף
            </button>
          </form>
        </div>
    );
  };

  const handleQuantityChange = (itemName, newQuantity) => {
    const val = Math.max(0, parseInt(newQuantity) || 0);
    setCart(prev => ({ ...prev, [itemName]: val }));
  };

  const handleIncrement = (itemName) => {
    setCart(prev => ({ ...prev, [itemName]: (prev[itemName] || 0) + 1 }));
  };

  const handleDecrement = (itemName) => {
    setCart(prev => {
      const current = prev[itemName] || 0;
      if (current <= 0) return prev;
      return { ...prev, [itemName]: current - 1 };
    });
  };

  const handleAddWeapon = () => {
    if (selectedWeaponType && selectedWeaponSerial) {
      if (!cartWeapons.find(w => w.type === selectedWeaponType && w.serial === selectedWeaponSerial)) {
        setCartWeapons(prev => [...prev, { type: selectedWeaponType, serial: selectedWeaponSerial }]);
      }
      setSelectedWeaponType('');
      setSelectedWeaponSerial('');
    }
  };

  const handleRemoveWeapon = (indexToRemove) => {
    setCartWeapons(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddOptic = () => {
    if (selectedOpticType && selectedOpticSerial) {
      if (!cartOptics.find(o => o.type === selectedOpticType && o.serial === selectedOpticSerial)) {
        setCartOptics(prev => [...prev, { type: selectedOpticType, serial: selectedOpticSerial }]);
      }
      setSelectedOpticType('');
      setSelectedOpticSerial('');
    }
  };

  const handleRemoveOptic = (indexToRemove) => {
    setCartOptics(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddComm = () => {
    if (selectedCommType && selectedCommSerial) {
      if (!cartComms.find(c => c.type === selectedCommType && c.serial === selectedCommSerial)) {
        setCartComms(prev => [...prev, { type: selectedCommType, serial: selectedCommSerial }]);
      }
      setSelectedCommType('');
      setSelectedCommSerial('');
    }
  };

  const handleRemoveComm = (indexToRemove) => {
    setCartComms(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!soldierName || !personalNumber) {
      setSubmitMessage('יש לבחור שם חייל ולהזין מספר אישי לפני השליחה.');
      setTimeout(() => setSubmitMessage(''), 3000);
      return;
    }

    const itemsDeltas = {};

    Object.entries(cart).forEach(([item, qty]) => {
      const oldQty = originalCart[item] || 0;
      const delta = qty - oldQty;
      if (delta !== 0) itemsDeltas[item] = delta;
    });

    Object.entries(originalCart).forEach(([item, oldQty]) => {
      if (cart[item] === undefined && oldQty > 0) {
        itemsDeltas[item] = -oldQty;
      }
    });

    const originalWeaponKeys = new Set(originalWeapons.map(w => `${w.type}-${w.serial}`));
    const currentWeaponKeys = new Set(cartWeapons.map(w => `${w.type}-${w.serial}`));
    const weaponsToAdd = cartWeapons.filter(w => !originalWeaponKeys.has(`${w.type}-${w.serial}`));
    const weaponsToReturn = originalWeapons.filter(w => !currentWeaponKeys.has(`${w.type}-${w.serial}`));

    const originalOpticKeys = new Set(originalOptics.map(o => `${o.type}-${o.serial}`));
    const currentOpticKeys = new Set(cartOptics.map(o => `${o.type}-${o.serial}`));
    const opticsToAdd = cartOptics.filter(o => !originalOpticKeys.has(`${o.type}-${o.serial}`));
    const opticsToReturn = originalOptics.filter(o => !currentOpticKeys.has(`${o.type}-${o.serial}`));

    const originalCommKeys = new Set(originalComms.map(c => `${c.type}-${c.serial}`));
    const currentCommKeys = new Set(cartComms.map(c => `${c.type}-${c.serial}`));
    const commsToAdd = cartComms.filter(c => !originalCommKeys.has(`${c.type}-${c.serial}`));
    const commsToReturn = originalComms.filter(c => !currentCommKeys.has(`${c.type}-${c.serial}`));

    if (
        Object.keys(itemsDeltas).length === 0 &&
        weaponsToAdd.length === 0 &&
        weaponsToReturn.length === 0 &&
        opticsToAdd.length === 0 &&
        opticsToReturn.length === 0 &&
        commsToAdd.length === 0 &&
        commsToReturn.length === 0
    ) {
      setSubmitMessage('לא בוצעו שינויים בציוד של החייל.');
      setTimeout(() => setSubmitMessage(''), 3000);
      return;
    }

    if (!user) return;
    setIsSubmitting(true);

    try {
      const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'inventory_requests');

      const requestPayload = {
        userId: user.uid,
        soldierName,
        personalNumber,
        items: itemsDeltas,
        timestamp: serverTimestamp(),
        submitter: loggedInAdmin,
        isUpdate: true
      };

      if (weaponsToAdd.length > 0) requestPayload.weapons = weaponsToAdd;
      if (weaponsToReturn.length > 0) requestPayload.returnedWeapons = weaponsToReturn;

      if (opticsToAdd.length > 0) requestPayload.optics = opticsToAdd;
      if (opticsToReturn.length > 0) requestPayload.returnedOptics = opticsToReturn;

      if (commsToAdd.length > 0) requestPayload.comms = commsToAdd;
      if (commsToReturn.length > 0) requestPayload.returnedComms = commsToReturn;

      await addDoc(requestsRef, requestPayload);

      if (GOOGLE_SHEETS_WEBHOOK_URL) {
        try {
          const dateStr = new Intl.DateTimeFormat('he-IL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }).format(new Date());

          const rowsToSync = [];

          Object.entries(itemsDeltas).forEach(([item, qty]) => {
            rowsToSync.push({
              date: dateStr, name: soldierName, id: personalNumber, item: item,
              qty: Math.abs(qty), action: qty < 0 ? 'החזרה' : 'משיכה', submitter: loggedInAdmin,
              weaponType: '', weaponSerial: ''
            });
          });

          weaponsToAdd.forEach(w => {
            rowsToSync.push({
              date: dateStr, name: soldierName, id: personalNumber, item: 'נשק',
              qty: 1, action: 'משיכה', submitter: loggedInAdmin, weaponType: w.type, weaponSerial: w.serial
            });
          });

          weaponsToReturn.forEach(w => {
            rowsToSync.push({
              date: dateStr, name: soldierName, id: personalNumber, item: 'נשק',
              qty: 1, action: 'החזרה', submitter: loggedInAdmin, weaponType: w.type, weaponSerial: w.serial
            });
          });

          opticsToAdd.forEach(o => {
            rowsToSync.push({
              date: dateStr, name: soldierName, id: personalNumber, item: 'אופטיקה',
              qty: 1, action: 'משיכה', submitter: loggedInAdmin, weaponType: o.type, weaponSerial: o.serial
            });
          });

          opticsToReturn.forEach(o => {
            rowsToSync.push({
              date: dateStr, name: soldierName, id: personalNumber, item: 'אופטיקה',
              qty: 1, action: 'החזרה', submitter: loggedInAdmin, weaponType: o.type, weaponSerial: o.serial
            });
          });

          commsToAdd.forEach(c => {
            rowsToSync.push({
              date: dateStr, name: soldierName, id: personalNumber, item: 'תקשוב',
              qty: 1, action: 'משיכה', submitter: loggedInAdmin, weaponType: c.type, weaponSerial: c.serial
            });
          });

          commsToReturn.forEach(c => {
            rowsToSync.push({
              date: dateStr, name: soldierName, id: personalNumber, item: 'תקשוב',
              qty: 1, action: 'החזרה', submitter: loggedInAdmin, weaponType: c.type, weaponSerial: c.serial
            });
          });

          if (rowsToSync.length > 0) {
            await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
              method: 'POST',
              body: JSON.stringify(rowsToSync),
              headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            });
          }
        } catch (syncError) {
          console.error("שגיאה בסנכרון לגוגל שיטס:", syncError);
        }
      }

      setFormSearchTerm('');
      setCart({}); setOriginalCart({});
      setCartWeapons([]); setOriginalWeapons([]);
      setCartOptics([]); setOriginalOptics([]);
      setCartComms([]); setOriginalComms([]);
      setSoldierName(''); setPersonalNumber('');
      setSubmitMessage('הציוד עודכן ונשמר בהצלחה בהיסטוריה!');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage('שגיאה בעדכון הציוד. אנא נסה שנית.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 4000);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'תאריך לא ידוע';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const totalItemsInCart = Object.values(cart).reduce((sum, qty) => sum + qty, 0) + cartWeapons.length + cartOptics.length + cartComms.length;

  const exportToCSV = () => {
    let csvContent = '\uFEFF';
    csvContent += 'תאריך,שם חייל,מספר אישי,פריט,כמות,פעולה,סוג ציוד,מספר סידורי\n';

    submissionHistory.forEach(entry => {
      const dateStr = formatDate(entry.timestamp).replace(/,/g, '');
      const name = entry.soldierName || 'לא הוזן שם';
      const id = entry.personalNumber || '';

      if (entry.items) {
        Object.entries(entry.items).forEach(([item, qty]) => {
          const action = qty < 0 ? 'החזרה' : 'משיכה';
          csvContent += `${dateStr},${name},${id},${item},${Math.abs(qty)},${action},,\n`;
        });
      }

      if (entry.weapons && entry.weapons.length > 0) {
        entry.weapons.forEach(w => {
          csvContent += `${dateStr},${name},${id},נשק,1,משיכה,${w.type},${w.serial}\n`;
        });
      }
      if (entry.returnedWeapons && entry.returnedWeapons.length > 0) {
        entry.returnedWeapons.forEach(w => {
          csvContent += `${dateStr},${name},${id},נשק,1,החזרה,${w.type},${w.serial}\n`;
        });
      }

      if (entry.optics && entry.optics.length > 0) {
        entry.optics.forEach(o => {
          csvContent += `${dateStr},${name},${id},אופטיקה,1,משיכה,${o.type},${o.serial}\n`;
        });
      }
      if (entry.returnedOptics && entry.returnedOptics.length > 0) {
        entry.returnedOptics.forEach(o => {
          csvContent += `${dateStr},${name},${id},אופטיקה,1,החזרה,${o.type},${o.serial}\n`;
        });
      }

      if (entry.comms && entry.comms.length > 0) {
        entry.comms.forEach(c => {
          csvContent += `${dateStr},${name},${id},תקשוב,1,משיכה,${c.type},${c.serial}\n`;
        });
      }
      if (entry.returnedComms && entry.returnedComms.length > 0) {
        entry.returnedComms.forEach(c => {
          csvContent += `${dateStr},${name},${id},תקשוב,1,החזרה,${c.type},${c.serial}\n`;
        });
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `נתוני_משיכות_והחזרות_ציוד.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDatabaseToCSV = () => {
    let csvContent = '\uFEFF';
    csvContent += 'קטגוריה,מספר סידורי\n';

    const appendData = (dataObj) => {
      Object.entries(dataObj).forEach(([category, serials]) => {
        serials.forEach(serial => {
          csvContent += `${category},${serial}\n`;
        });
      });
    };

    appendData(weaponsData);
    appendData(opticsData);
    appendData(commsData);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `מסד_נתונים_לוגיסטיקה.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dashboardItems = Array.from(new Set([
    ...Object.keys(inventoryTotals),
    ...Object.keys(totalStock)
  ])).sort();

  const filteredFormSoldiers = soldiersData.filter(s =>
      s.name.includes(formSearchTerm) || (s.id && s.id.includes(formSearchTerm))
  );

  const filteredDashboardSoldiers = soldiersData.filter(s =>
      s.name.includes(dashboardSearchTerm) || (s.id && s.id.includes(dashboardSearchTerm))
  );

  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800 font-sans" dir="rtl">
          <div className="text-xl font-medium animate-pulse">מתחבר למערכת...</div>
        </div>
    );
  }

  if (!isAuthenticated) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans text-slate-800 px-4" dir="rtl">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
            <div className="flex justify-center mb-6">
              <img
                  src="https://lh3.googleusercontent.com/d/10_CQKAY6svTjuNvdbJGOiOnDh0yn1dIk"
                  alt="לוגו"
                  className="w-48 h-auto object-contain drop-shadow-sm"
              />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">ניהול לוגיסטיקה רובאית</h2>
            <p className="text-center text-slate-500 mb-8 text-sm">אנא הזן את פרטיך האישיים כדי להמשיך</p>

            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-bold border border-red-100">
                    {loginError}
                  </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">שם פרטי</label>
                <input
                    type="text"
                    autoComplete="off"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="לדוגמה: ברק"
                    className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">סיסמה (מספר אישי)</label>
                <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="new-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="הזן מספר אישי"
                    className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl mt-6 shadow-md hover:shadow-lg transition-all"
              >
                כניסה למערכת
              </button>
            </form>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 font-sans text-slate-800 pb-20" dir="rtl">
        <header className="bg-blue-700 text-white shadow-md sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ClipboardList className="w-6 h-6" />
                ניהול לוגיסטיקה רובאית
              </h1>
              <div className="bg-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-600">
                מחובר כ: {loggedInAdmin}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4 mt-6">
              <button
                  onClick={() => setActiveTab('form')}
                  className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'form'
                          ? 'border-white text-white'
                          : 'border-transparent text-blue-200 hover:text-white'
                  }`}
              >
              <span className="flex items-center gap-1">
                <ShoppingCart className="w-4 h-4" />
                טופס מאסטר (משיכות)
              </span>
              </button>
              <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'dashboard'
                          ? 'border-white text-white'
                          : 'border-transparent text-blue-200 hover:text-white'
                  }`}
              >
              <span className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                ספירה כללית
              </span>
              </button>
              <button
                  onClick={() => setActiveTab('inventory')}
                  className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'inventory'
                          ? 'border-white text-white'
                          : 'border-transparent text-blue-200 hover:text-white'
                  }`}
              >
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                ניהול מלאי
              </span>
              </button>
              <button
                  onClick={() => setActiveTab('categories')}
                  className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'categories'
                          ? 'border-white text-white'
                          : 'border-transparent text-blue-200 hover:text-white'
                  }`}
              >
              <span className="flex items-center gap-1">
                <Tags className="w-4 h-4" />
                ניהול פריטים
              </span>
              </button>
              <button
                  onClick={() => setActiveTab('soldiers')}
                  className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'soldiers'
                          ? 'border-white text-white'
                          : 'border-transparent text-blue-200 hover:text-white'
                  }`}
              >
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                ניהול חיילים
              </span>
              </button>
              <button
                  onClick={() => setActiveTab('database')}
                  className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'database'
                          ? 'border-white text-white'
                          : 'border-transparent text-blue-200 hover:text-white'
                  }`}
              >
              <span className="flex items-center gap-1">
                <Database className="w-4 h-4" />
                ניהול צלמים
              </span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">

          {submitMessage && (
              <div className={`p-4 mb-6 rounded-lg font-medium shadow-sm ${
                  submitMessage.includes('שגיאה') || submitMessage.includes('לא בוצעו') ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-700'
              }`}>
                {submitMessage}
              </div>
          )}

          {/* --- TAB: SOLDIERS MANAGER --- */}
          {activeTab === 'soldiers' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-700">ניהול חיילים ומחלקות</h2>
                    <p className="text-sm text-slate-500">הוסף חיילים חדשים, ערוך שמות, מספרים אישיים ושיוך מחלקתי.</p>
                  </div>
                  <button
                      onClick={handleSaveSoldiers}
                      disabled={isSavingSoldiers}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:bg-slate-300 w-full sm:w-auto"
                  >
                    {isSavingSoldiers ? 'שומר...' : 'שמור רשימה'}
                    {!isSavingSoldiers && <Save className="w-4 h-4" />}
                  </button>
                </div>

                {soldierSaveMessage && (
                    <div className="bg-green-100 text-green-700 p-4 rounded-lg font-medium shadow-sm mb-4">
                      {soldierSaveMessage}
                    </div>
                )}

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
                  <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                    הוספת חייל חדש
                  </h3>
                  <form onSubmit={handleAddSoldier} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">שם מלא</label>
                      <input
                          required
                          value={newSoldier.name}
                          onChange={e => setNewSoldier({...newSoldier, name: e.target.value})}
                          className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">מספר אישי</label>
                      <input
                          required
                          value={newSoldier.id}
                          onChange={e => setNewSoldier({...newSoldier, id: e.target.value})}
                          className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">מחלקה</label>
                      <input
                          value={newSoldier.department}
                          onChange={e => setNewSoldier({...newSoldier, department: e.target.value})}
                          className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white rounded-lg p-2 font-bold transition-colors">
                      הוסף חייל
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                      <thead>
                      <tr className="bg-slate-100 text-slate-600 text-sm">
                        <th className="p-3 border-b border-slate-200">שם החייל</th>
                        <th className="p-3 border-b border-slate-200">מספר אישי</th>
                        <th className="p-3 border-b border-slate-200">מחלקה</th>
                        <th className="p-3 border-b border-slate-200 text-center">הרשאת מפל״ג</th>
                        <th className="p-3 border-b border-slate-200 text-center w-16">הסרה</th>
                      </tr>
                      </thead>
                      <tbody>
                      {soldiersData.map((soldier, idx) => (
                          <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50">
                            <td className="p-2">
                              <input
                                  value={soldier.name}
                                  onChange={(e) => handleUpdateSoldier(idx, 'name', e.target.value)}
                                  className="w-full border-none bg-transparent p-1 outline-none focus:bg-white focus:ring-1 focus:ring-blue-300 rounded"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                  value={soldier.id}
                                  onChange={(e) => handleUpdateSoldier(idx, 'id', e.target.value)}
                                  className="w-full border-none bg-transparent p-1 outline-none focus:bg-white focus:ring-1 focus:ring-blue-300 rounded font-mono text-sm"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                  value={soldier.department || ''}
                                  onChange={(e) => handleUpdateSoldier(idx, 'department', e.target.value)}
                                  className="w-full border-none bg-transparent p-1 outline-none focus:bg-white focus:ring-1 focus:ring-blue-300 rounded"
                                  placeholder="ללא מחלקה"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                  type="checkbox"
                                  checked={!!soldier.isMaplag}
                                  onChange={(e) => handleUpdateSoldier(idx, 'isMaplag', e.target.checked)}
                                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <button
                                  onClick={() => handleRemoveSoldier(idx)}
                                  className="text-red-500 hover:text-red-700 p-1 bg-white rounded shadow-sm border border-red-100"
                                  title="הסר חייל"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
          )}

          {/* --- TAB: INVENTORY MANAGER --- */}
          {activeTab === 'inventory' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-700">ניהול מלאי כללי</h2>
                    <p className="text-sm text-slate-500">הזן את הכמויות הכלליות שיש במלאי מכל פריט. הנתונים יוצגו בטבלת הספירה הכללית להשוואה.</p>
                  </div>
                  <button
                      onClick={handleSaveStock}
                      disabled={isSavingStock}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:bg-slate-300 w-full sm:w-auto"
                  >
                    {isSavingStock ? 'שומר...' : 'שמור מלאי'}
                    {!isSavingStock && <Save className="w-4 h-4" />}
                  </button>
                </div>

                {stockSaveMessage && (
                    <div className="bg-green-100 text-green-700 p-4 rounded-lg font-medium shadow-sm mb-4">
                      {stockSaveMessage}
                    </div>
                )}

                {Object.entries(inventoryCategories).map(([categoryName, items], idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                        <h3 className="font-bold text-slate-700">{categoryName}</h3>
                      </div>
                      <div className="divide-y divide-slate-100 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map(item => (
                            <div key={item} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <span className="font-medium text-slate-800">{item}</span>
                              <input
                                  type="number"
                                  min="0"
                                  value={totalStock[item] === undefined ? '' : totalStock[item]}
                                  onChange={(e) => setTotalStock(prev => ({...prev, [item]: Math.max(0, parseInt(e.target.value) || 0)}))}
                                  placeholder="0"
                                  className="w-24 border border-slate-300 rounded-lg p-2 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                        ))}
                      </div>
                    </div>
                ))}
              </div>
          )}

          {/* --- TAB: CATEGORIES MANAGER --- */}
          {activeTab === 'categories' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-700">ניהול סוגי פריטים</h2>
                    <p className="text-sm text-slate-500">ערוך, הוסף ושנה את סוגי הפריטים והקטגוריות הזמינים למשיכה ומופיעים במלאי.</p>
                  </div>
                  <button
                      onClick={handleSaveCategories}
                      disabled={isSavingCategories}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:bg-slate-300 w-full sm:w-auto"
                  >
                    {isSavingCategories ? 'שומר...' : 'שמור שינויים'}
                    {!isSavingCategories && <Save className="w-4 h-4" />}
                  </button>
                </div>

                {categoriesSaveMessage && (
                    <div className="bg-green-100 text-green-700 p-4 rounded-lg font-medium shadow-sm mb-4">
                      {categoriesSaveMessage}
                    </div>
                )}

                {renderDbEditor(inventoryCategories, setInventoryCategories, 'קטגוריות ופריטים למשיכה', <Tags className="w-5 h-5 text-indigo-600" />)}
              </div>
          )}

          {/* --- TAB: DATABASE EDITOR --- */}
          {activeTab === 'database' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-700">ניהול צלמים</h2>
                    <p className="text-sm text-slate-500">הזן את המספרים הסידוריים מופרדים בשורה חדשה (אנטר). כל שינוי ישפיע ישירות על האפשרויות בטופס המאסטר.</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={exportDatabaseToCSV}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-colors flex-1 sm:flex-none"
                    >
                      <Download className="w-4 h-4" />
                      ייצוא מסד נתונים
                    </button>
                    <button
                        onClick={handleSaveDatabase}
                        disabled={isSavingDb}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:bg-slate-300 flex-1 sm:flex-none"
                    >
                      {isSavingDb ? 'שומר...' : 'שמור שינויים'}
                      {!isSavingDb && <Save className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {dbSaveMessage && (
                    <div className="bg-green-100 text-green-700 p-4 rounded-lg font-medium shadow-sm mb-4">
                      {dbSaveMessage}
                    </div>
                )}

                {renderDbEditor(weaponsData, setWeaponsData, 'כלי נשק', <Crosshair className="w-5 h-5 text-red-600" />)}
                {renderDbEditor(opticsData, setOpticsData, 'אופטיקה', <Eye className="w-5 h-5 text-indigo-600" />)}
                {renderDbEditor(commsData, setCommsData, 'תקשוב', <Radio className="w-5 h-5 text-emerald-600" />)}
              </div>
          )}

          {activeTab === 'form' && (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-4">
                    <User className="w-5 h-5" />
                    בחר חייל להצגה ועדכון ציוד
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-700 mb-1">חיפוש חייל (שם או מ.א)</label>
                      <div className="relative">
                        <input
                            type="text"
                            value={formSearchTerm}
                            onChange={(e) => {
                              setFormSearchTerm(e.target.value);
                              setIsFormDropdownOpen(true);
                              if (e.target.value === '') {
                                selectSoldierForForm(null);
                              }
                            }}
                            onFocus={() => setIsFormDropdownOpen(true)}
                            onBlur={() => setTimeout(() => setIsFormDropdownOpen(false), 200)}
                            placeholder="הקלד לחיפוש חייל..."
                            className="w-full border border-slate-300 rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                      </div>
                      {isFormDropdownOpen && (
                          <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            {filteredFormSoldiers.length > 0 ? (
                                filteredFormSoldiers.map((soldier, idx) => (
                                    <li
                                        key={idx}
                                        onMouseDown={() => selectSoldierForForm(soldier)}
                                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 text-slate-700"
                                    >
                                      {soldier.name} <span className="text-slate-400 text-sm ml-1">{soldier.id ? `- ${soldier.id}` : ''} {soldier.department ? `| ${soldier.department}` : ''}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="p-3 text-slate-500 text-sm text-center">לא נמצאו חיילים התואמים לחיפוש</li>
                            )}
                          </ul>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">מספר אישי מקושר</label>
                      <input
                          type="text"
                          value={personalNumber}
                          placeholder="מספר אישי יופיע כאן אוטומטית"
                          className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-500 cursor-not-allowed"
                          readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* --- Weapon Selection --- */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-4">
                    <Crosshair className="w-5 h-5 text-red-600" />
                    כלי נשק של החייל
                  </h2>
                  <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
                    <div className="w-full md:w-1/3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">הוסף נשק חדש (סוג)</label>
                      <select
                          value={selectedWeaponType}
                          onChange={(e) => {
                            setSelectedWeaponType(e.target.value);
                            setSelectedWeaponSerial('');
                          }}
                          className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="" disabled>בחר סוג...</option>
                        {Object.keys(weaponsData).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full md:w-1/3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">מספר נשק</label>
                      <select
                          value={selectedWeaponSerial}
                          onChange={(e) => setSelectedWeaponSerial(e.target.value)}
                          disabled={!selectedWeaponType}
                          className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <option value="" disabled>בחר מספר...</option>
                        {selectedWeaponType && (weaponsData[selectedWeaponType] || []).filter(s => s.trim() !== '').map(serial => (
                            <option key={serial} value={serial}>{serial}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full md:w-1/3">
                      <button
                          onClick={handleAddWeapon}
                          disabled={!selectedWeaponType || !selectedWeaponSerial}
                          className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:text-slate-500 text-white p-2.5 rounded-lg font-bold transition-colors"
                      >
                        הוסף לחייל
                      </button>
                    </div>
                  </div>

                  {cartWeapons.length > 0 ? (
                      <div className="border-t border-slate-100 pt-4">
                        <h3 className="text-sm font-bold text-slate-600 mb-2">כלי נשק נוכחיים (ניתן למחוק במידה והוחזרו):</h3>
                        <div className="space-y-2">
                          {cartWeapons.map((weapon, idx) => {
                            const isNew = !originalWeapons.find(w => w.type === weapon.type && w.serial === weapon.serial);
                            return (
                                <div key={idx} className={`flex justify-between items-center px-3 py-2 rounded-lg border ${isNew ? 'bg-green-50 border-green-200 text-green-900' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                          <span className="font-medium">
                            {weapon.type} - {weapon.serial} {isNew && <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded mr-2">נוסף כעת</span>}
                          </span>
                                  <button
                                      onClick={() => handleRemoveWeapon(idx)}
                                      className="text-red-500 hover:text-red-700 p-1 bg-white rounded shadow-sm border border-red-100"
                                      title="הסר מהחייל (החזרה)"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                            );
                          })}
                        </div>
                      </div>
                  ) : (
                      <div className="text-sm text-slate-500 border-t border-slate-100 pt-4">אין נשקים חתומים על החייל.</div>
                  )}
                </div>

                {/* --- Optics Selection --- */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    אופטיקה
                  </h2>
                  <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
                    <div className="w-full md:w-1/3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">הוסף אופטיקה (סוג)</label>
                      <select
                          value={selectedOpticType}
                          onChange={(e) => {
                            setSelectedOpticType(e.target.value);
                            setSelectedOpticSerial('');
                          }}
                          className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="" disabled>בחר סוג...</option>
                        {Object.keys(opticsData).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full md:w-1/3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">מספר סידורי</label>
                      <select
                          value={selectedOpticSerial}
                          onChange={(e) => setSelectedOpticSerial(e.target.value)}
                          disabled={!selectedOpticType}
                          className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <option value="" disabled>בחר מספר...</option>
                        {selectedOpticType && (opticsData[selectedOpticType] || []).filter(s => s.trim() !== '').map(serial => (
                            <option key={serial} value={serial}>{serial}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full md:w-1/3">
                      <button
                          onClick={handleAddOptic}
                          disabled={!selectedOpticType || !selectedOpticSerial}
                          className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:text-slate-500 text-white p-2.5 rounded-lg font-bold transition-colors"
                      >
                        הוסף לחייל
                      </button>
                    </div>
                  </div>

                  {cartOptics.length > 0 ? (
                      <div className="border-t border-slate-100 pt-4">
                        <h3 className="text-sm font-bold text-slate-600 mb-2">אופטיקה נוכחית (ניתן למחוק במידה והוחזרו):</h3>
                        <div className="space-y-2">
                          {cartOptics.map((optic, idx) => {
                            const isNew = !originalOptics.find(o => o.type === optic.type && o.serial === optic.serial);
                            return (
                                <div key={idx} className={`flex justify-between items-center px-3 py-2 rounded-lg border ${isNew ? 'bg-green-50 border-green-200 text-green-900' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                          <span className="font-medium">
                            {optic.type} - {optic.serial} {isNew && <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded mr-2">נוסף כעת</span>}
                          </span>
                                  <button
                                      onClick={() => handleRemoveOptic(idx)}
                                      className="text-red-500 hover:text-red-700 p-1 bg-white rounded shadow-sm border border-red-100"
                                      title="הסר מהחייל (החזרה)"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                            );
                          })}
                        </div>
                      </div>
                  ) : (
                      <div className="text-sm text-slate-500 border-t border-slate-100 pt-4">אין אופטיקה חתומה על החייל.</div>
                  )}
                </div>

                {/* --- Comms Selection --- */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-4">
                    <Radio className="w-5 h-5 text-emerald-600" />
                    תקשוב
                  </h2>
                  <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
                    <div className="w-full md:w-1/3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">הוסף תקשוב (סוג)</label>
                      <select
                          value={selectedCommType}
                          onChange={(e) => {
                            setSelectedCommType(e.target.value);
                            setSelectedCommSerial('');
                          }}
                          className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="" disabled>בחר סוג...</option>
                        {Object.keys(commsData).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full md:w-1/3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">מספר סידורי</label>
                      <select
                          value={selectedCommSerial}
                          onChange={(e) => setSelectedCommSerial(e.target.value)}
                          disabled={!selectedCommType}
                          className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <option value="" disabled>בחר מספר...</option>
                        {selectedCommType && (commsData[selectedCommType] || []).filter(s => s.trim() !== '').map(serial => (
                            <option key={serial} value={serial}>{serial}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full md:w-1/3">
                      <button
                          onClick={handleAddComm}
                          disabled={!selectedCommType || !selectedCommSerial}
                          className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:text-slate-500 text-white p-2.5 rounded-lg font-bold transition-colors"
                      >
                        הוסף לחייל
                      </button>
                    </div>
                  </div>

                  {cartComms.length > 0 ? (
                      <div className="border-t border-slate-100 pt-4">
                        <h3 className="text-sm font-bold text-slate-600 mb-2">תקשוב נוכחי (ניתן למחוק במידה והוחזרו):</h3>
                        <div className="space-y-2">
                          {cartComms.map((comm, idx) => {
                            const isNew = !originalComms.find(c => c.type === comm.type && c.serial === comm.serial);
                            return (
                                <div key={idx} className={`flex justify-between items-center px-3 py-2 rounded-lg border ${isNew ? 'bg-green-50 border-green-200 text-green-900' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                          <span className="font-medium">
                            {comm.type} - {comm.serial} {isNew && <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded mr-2">נוסף כעת</span>}
                          </span>
                                  <button
                                      onClick={() => handleRemoveComm(idx)}
                                      className="text-red-500 hover:text-red-700 p-1 bg-white rounded shadow-sm border border-red-100"
                                      title="הסר מהחייל (החזרה)"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                            );
                          })}
                        </div>
                      </div>
                  ) : (
                      <div className="text-sm text-slate-500 border-t border-slate-100 pt-4">אין פריטי תקשוב חתומים על החייל.</div>
                  )}
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-700">הציוד של החייל (ניתן לעדכן כמויות ולשמור)</h2>
                    <p className="text-sm text-slate-500">הוסף למשיכה חדשה, או הפחת כדי לסמן החזרת ציוד.</p>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    סה״כ: {totalItemsInCart} פריטים נבחרו
                  </div>
                </div>

                {Object.entries(inventoryCategories).map(([categoryName, items], idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                        <h3 className="font-bold text-slate-700">{categoryName}</h3>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {items.map((item, itemIdx) => {
                          const originalQty = originalCart[item] || 0;
                          const currentQty = cart[item] || 0;
                          const isChanged = currentQty !== originalQty;

                          return (
                              <div key={itemIdx} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isChanged ? 'bg-yellow-50' : 'hover:bg-slate-50'}`}>
                                <div className="flex flex-col">
                                  <span className="font-medium text-slate-800">{item}</span>
                                  {originalQty > 0 && (
                                      <span className="text-xs text-slate-500">
                              כמות מקורית לפני עדכון: {originalQty}
                            </span>
                                  )}
                                </div>

                                <div className="flex items-center justify-end gap-2">
                                  <button
                                      onClick={() => handleDecrement(item)}
                                      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>

                                  <input
                                      type="number"
                                      min="0"
                                      value={currentQty === 0 ? '' : currentQty}
                                      onChange={(e) => handleQuantityChange(item, e.target.value)}
                                      placeholder="0"
                                      className={`w-16 h-10 text-center border rounded-lg outline-none font-bold text-lg ${isChanged ? 'border-yellow-400 focus:ring-2 focus:ring-yellow-500 bg-white' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                                  />

                                  <button
                                      onClick={() => handleIncrement(item)}
                                      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300 transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                          );
                        })}
                      </div>
                    </div>
                ))}

                <div className="sticky bottom-4 mt-8">
                  <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !soldierName}
                      className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${
                          isSubmitting || !soldierName
                              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-xl hover:-translate-y-1'
                      }`}
                  >
                    {isSubmitting ? 'מעדכן נתונים...' : 'שמור שינויים בציוד החייל'}
                    {!isSubmitting && <Send className="w-5 h-5 mr-2" />}
                  </button>
                </div>
              </div>
          )}

          {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {isLoadingData ? (
                    <div className="text-center py-10 text-slate-500">טוען נתונים מהענן...</div>
                ) : (
                    <>
                      <div className="flex justify-end mb-4">
                        <button
                            onClick={exportToCSV}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors"
                        >
                          <Download className="w-5 h-5" />
                          ייצוא נתונים לאקסל (CSV)
                        </button>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            ספירה כללית של ציוד שנמשך (מחושב החזרות)
                          </h2>
                          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      מתעדכן בזמן אמת
                    </span>
                        </div>

                        {dashboardItems.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                              טרם נמשכו פריטים במערכת וטרם הוזן מלאי כללי.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-right border-collapse">
                                <thead>
                                <tr className="bg-slate-100 text-slate-600 text-sm">
                                  <th className="p-4 font-bold border-b border-slate-200">שם פריט</th>
                                  <th className="p-4 font-bold border-b border-slate-200 text-center">מלאי כללי</th>
                                  <th className="p-4 font-bold border-b border-slate-200 text-center">נמשך לשטח</th>
                                  <th className="p-4 font-bold border-b border-slate-200 text-center">נותר במלאי</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {dashboardItems.map((item) => {
                                  const stock = totalStock[item] || 0;
                                  const drawn = inventoryTotals[item] || 0;
                                  const remaining = stock - drawn;

                                  return (
                                      <tr key={item} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-800">{item}</td>
                                        <td className="p-4 text-center text-slate-600 font-bold">{stock > 0 ? stock : '-'}</td>
                                        <td className="p-4 text-center">
                                          {drawn > 0 ? (
                                              <span className="inline-block bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-lg">
                                      {drawn}
                                    </span>
                                          ) : (
                                              <span className="text-slate-400">-</span>
                                          )}
                                        </td>
                                        <td className="p-4 text-center">
                                          {(stock > 0 || drawn > 0) ? (
                                              <span className={`inline-block font-bold px-3 py-1 rounded-lg ${remaining < 0 ? 'bg-red-100 text-red-800' : remaining === 0 && stock > 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                      {remaining}
                                    </span>
                                          ) : (
                                              <span className="text-slate-400">-</span>
                                          )}
                                        </td>
                                      </tr>
                                  );
                                })}
                                </tbody>
                              </table>
                            </div>
                        )}
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50">
                          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-blue-600" />
                            ציוד נוכחי לפי חייל
                          </h2>
                          <div className="w-full md:w-1/2 relative">
                            <div className="relative">
                              <input
                                  type="text"
                                  value={dashboardSearchTerm}
                                  onChange={(e) => {
                                    setDashboardSearchTerm(e.target.value);
                                    setIsDashboardDropdownOpen(true);
                                    if (e.target.value === '') {
                                      selectSoldierForDashboard(null);
                                    }
                                  }}
                                  onFocus={() => setIsDashboardDropdownOpen(true)}
                                  onBlur={() => setTimeout(() => setIsDashboardDropdownOpen(false), 200)}
                                  placeholder="הקלד לחיפוש חייל..."
                                  className="w-full border border-slate-300 rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              />
                              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                            </div>
                            {isDashboardDropdownOpen && (
                                <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                  {filteredDashboardSoldiers.length > 0 ? (
                                      filteredDashboardSoldiers.map((soldier, idx) => (
                                          <li
                                              key={idx}
                                              onMouseDown={() => selectSoldierForDashboard(soldier)}
                                              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 text-slate-700"
                                          >
                                            {soldier.name} <span className="text-slate-400 text-sm ml-1">{soldier.id ? `- ${soldier.id}` : ''} {soldier.department ? `| ${soldier.department}` : ''}</span>
                                          </li>
                                      ))
                                  ) : (
                                      <li className="p-3 text-slate-500 text-sm text-center">לא נמצאו חיילים התואמים לחיפוש</li>
                                  )}
                                </ul>
                            )}
                          </div>
                        </div>

                        {selectedSoldier && (
                            <div className="p-4">
                              {(() => {
                                const soldierHistory = [...submissionHistory]
                                    .filter(entry => entry.soldierName === selectedSoldier)
                                    .reverse();

                                if (soldierHistory.length === 0) {
                                  return <div className="text-center text-slate-500 py-4">לא נמצאו משיכות ציוד עבור חייל זה.</div>;
                                }

                                const specificTotals = {};
                                const weaponsMap = new Map();
                                const opticsMap = new Map();
                                const commsMap = new Map();

                                soldierHistory.forEach(entry => {
                                  if (entry.items) {
                                    Object.entries(entry.items).forEach(([item, qty]) => {
                                      specificTotals[item] = (specificTotals[item] || 0) + Number(qty);
                                    });
                                  }
                                  if (entry.weapons) {
                                    entry.weapons.forEach(w => weaponsMap.set(`${w.type}-${w.serial}`, w));
                                  }
                                  if (entry.returnedWeapons) {
                                    entry.returnedWeapons.forEach(w => weaponsMap.delete(`${w.type}-${w.serial}`));
                                  }
                                  if (entry.optics) {
                                    entry.optics.forEach(o => opticsMap.set(`${o.type}-${o.serial}`, o));
                                  }
                                  if (entry.returnedOptics) {
                                    entry.returnedOptics.forEach(o => opticsMap.delete(`${o.type}-${o.serial}`));
                                  }
                                  if (entry.comms) {
                                    entry.comms.forEach(c => commsMap.set(`${c.type}-${c.serial}`, c));
                                  }
                                  if (entry.returnedComms) {
                                    entry.returnedComms.forEach(c => commsMap.delete(`${c.type}-${c.serial}`));
                                  }
                                });

                                Object.keys(specificTotals).forEach(k => {
                                  if (specificTotals[k] <= 0) delete specificTotals[k];
                                });
                                const specificWeapons = Array.from(weaponsMap.values());
                                const specificOptics = Array.from(opticsMap.values());
                                const specificComms = Array.from(commsMap.values());

                                if (Object.keys(specificTotals).length === 0 && specificWeapons.length === 0 && specificOptics.length === 0 && specificComms.length === 0) {
                                  return <div className="text-center text-slate-500 py-4">החייל החזיר את כל הציוד שלו.</div>;
                                }

                                return (
                                    <div>
                                      <div className="flex flex-wrap gap-3 mt-2">
                                        {Object.entries(specificTotals)
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([item, qty]) => (
                                                <div key={item} className="bg-indigo-50 border border-indigo-100 text-indigo-800 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
                                                  <span className="font-medium">{item}</span>
                                                  <span className="bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded-md text-sm">
                                    {qty}
                                  </span>
                                                </div>
                                            ))}
                                      </div>

                                      {specificWeapons.length > 0 && (
                                          <div className="mt-4 pt-4 border-t border-slate-100">
                                            <h3 className="font-bold text-slate-600 mb-2">כלי נשק:</h3>
                                            <div className="flex flex-wrap gap-2">
                                              {specificWeapons.map((w, i) => (
                                                  <div key={i} className="bg-red-50 border border-red-100 text-red-800 px-3 py-1.5 rounded-md text-sm font-medium">
                                                    {w.type} | מ. נשק: {w.serial}
                                                  </div>
                                              ))}
                                            </div>
                                          </div>
                                      )}

                                      {specificOptics.length > 0 && (
                                          <div className="mt-4 pt-4 border-t border-slate-100">
                                            <h3 className="font-bold text-slate-600 mb-2">אופטיקה:</h3>
                                            <div className="flex flex-wrap gap-2">
                                              {specificOptics.map((o, i) => (
                                                  <div key={i} className="bg-indigo-50 border border-indigo-100 text-indigo-800 px-3 py-1.5 rounded-md text-sm font-medium">
                                                    {o.type} | מספר: {o.serial}
                                                  </div>
                                              ))}
                                            </div>
                                          </div>
                                      )}

                                      {specificComms.length > 0 && (
                                          <div className="mt-4 pt-4 border-t border-slate-100">
                                            <h3 className="font-bold text-slate-600 mb-2">תקשוב:</h3>
                                            <div className="flex flex-wrap gap-2">
                                              {specificComms.map((c, i) => (
                                                  <div key={i} className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1.5 rounded-md text-sm font-medium">
                                                    {c.type} | מספר: {c.serial}
                                                  </div>
                                              ))}
                                            </div>
                                          </div>
                                      )}
                                    </div>
                                );
                              })()}
                            </div>
                        )}
                      </div>

                      {/* --- Weapon Summary Table --- */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <Crosshair className="w-5 h-5 text-red-600" />
                            כלי נשק שנמצאים כרגע אצל חיילים
                          </h2>
                        </div>

                        {(() => {
                          const weaponsMap = new Map();
                          [...submissionHistory].reverse().forEach(entry => {
                            if (entry.weapons) {
                              entry.weapons.forEach(w => {
                                weaponsMap.set(`${w.type}-${w.serial}`, {
                                  ...w,
                                  soldierName: entry.soldierName || 'לא ידוע',
                                  personalNumber: entry.personalNumber || '-',
                                  timestamp: entry.timestamp
                                });
                              });
                            }
                            if (entry.returnedWeapons) {
                              entry.returnedWeapons.forEach(w => weaponsMap.delete(`${w.type}-${w.serial}`));
                            }
                          });

                          const allWeaponsDrawn = Array.from(weaponsMap.values());

                          if (allWeaponsDrawn.length === 0) {
                            return (
                                <div className="p-8 text-center text-slate-500">
                                  טרם נמשכו כלי נשק במערכת או שכולם הוחזרו.
                                </div>
                            );
                          }

                          return (
                              <div className="overflow-x-auto">
                                <table className="w-full text-right border-collapse">
                                  <thead>
                                  <tr className="bg-slate-100 text-slate-600 text-sm">
                                    <th className="p-4 font-bold border-b border-slate-200">סוג נשק</th>
                                    <th className="p-4 font-bold border-b border-slate-200">מספר נשק</th>
                                    <th className="p-4 font-bold border-b border-slate-200">שם החייל</th>
                                    <th className="p-4 font-bold border-b border-slate-200">מספר אישי</th>
                                    <th className="p-4 font-bold border-b border-slate-200">תאריך משיכה מקורי</th>
                                  </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                  {allWeaponsDrawn.map((record, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-800">{record.type}</td>
                                        <td className="p-4 font-mono text-slate-600">{record.serial}</td>
                                        <td className="p-4">{record.soldierName}</td>
                                        <td className="p-4">{record.personalNumber}</td>
                                        <td className="p-4 text-sm text-slate-500">{formatDate(record.timestamp)}</td>
                                      </tr>
                                  ))}
                                  </tbody>
                                </table>
                              </div>
                          );
                        })()}
                      </div>

                      {/* --- Optics Summary Table --- */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-indigo-600" />
                            אופטיקה שנמצאת כרגע אצל חיילים
                          </h2>
                        </div>

                        {(() => {
                          const opticsMap = new Map();
                          [...submissionHistory].reverse().forEach(entry => {
                            if (entry.optics) {
                              entry.optics.forEach(o => {
                                opticsMap.set(`${o.type}-${o.serial}`, {
                                  ...o,
                                  soldierName: entry.soldierName || 'לא ידוע',
                                  personalNumber: entry.personalNumber || '-',
                                  timestamp: entry.timestamp
                                });
                              });
                            }
                            if (entry.returnedOptics) {
                              entry.returnedOptics.forEach(o => opticsMap.delete(`${o.type}-${o.serial}`));
                            }
                          });

                          const allOpticsDrawn = Array.from(opticsMap.values());

                          if (allOpticsDrawn.length === 0) {
                            return (
                                <div className="p-8 text-center text-slate-500">
                                  טרם נמשכה אופטיקה במערכת או שכולה הוחזרה.
                                </div>
                            );
                          }

                          return (
                              <div className="overflow-x-auto">
                                <table className="w-full text-right border-collapse">
                                  <thead>
                                  <tr className="bg-slate-100 text-slate-600 text-sm">
                                    <th className="p-4 font-bold border-b border-slate-200">סוג ציוד</th>
                                    <th className="p-4 font-bold border-b border-slate-200">מספר סידורי</th>
                                    <th className="p-4 font-bold border-b border-slate-200">שם החייל</th>
                                    <th className="p-4 font-bold border-b border-slate-200">מספר אישי</th>
                                    <th className="p-4 font-bold border-b border-slate-200">תאריך משיכה מקורי</th>
                                  </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                  {allOpticsDrawn.map((record, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-800">{record.type}</td>
                                        <td className="p-4 font-mono text-slate-600">{record.serial}</td>
                                        <td className="p-4">{record.soldierName}</td>
                                        <td className="p-4">{record.personalNumber}</td>
                                        <td className="p-4 text-sm text-slate-500">{formatDate(record.timestamp)}</td>
                                      </tr>
                                  ))}
                                  </tbody>
                                </table>
                              </div>
                          );
                        })()}
                      </div>

                      {/* --- Comms Summary Table --- */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <Radio className="w-5 h-5 text-emerald-600" />
                            תקשוב שנמצא כרגע אצל חיילים
                          </h2>
                        </div>

                        {(() => {
                          const commsMap = new Map();
                          [...submissionHistory].reverse().forEach(entry => {
                            if (entry.comms) {
                              entry.comms.forEach(c => {
                                commsMap.set(`${c.type}-${c.serial}`, {
                                  ...c,
                                  soldierName: entry.soldierName || 'לא ידוע',
                                  personalNumber: entry.personalNumber || '-',
                                  timestamp: entry.timestamp
                                });
                              });
                            }
                            if (entry.returnedComms) {
                              entry.returnedComms.forEach(c => commsMap.delete(`${c.type}-${c.serial}`));
                            }
                          });

                          const allCommsDrawn = Array.from(commsMap.values());

                          if (allCommsDrawn.length === 0) {
                            return (
                                <div className="p-8 text-center text-slate-500">
                                  טרם נמשך ציוד תקשוב במערכת או שכולו הוחזר.
                                </div>
                            );
                          }

                          return (
                              <div className="overflow-x-auto">
                                <table className="w-full text-right border-collapse">
                                  <thead>
                                  <tr className="bg-slate-100 text-slate-600 text-sm">
                                    <th className="p-4 font-bold border-b border-slate-200">סוג ציוד</th>
                                    <th className="p-4 font-bold border-b border-slate-200">מספר סידורי</th>
                                    <th className="p-4 font-bold border-b border-slate-200">שם החייל</th>
                                    <th className="p-4 font-bold border-b border-slate-200">מספר אישי</th>
                                    <th className="p-4 font-bold border-b border-slate-200">תאריך משיכה מקורי</th>
                                  </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                  {allCommsDrawn.map((record, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-800">{record.type}</td>
                                        <td className="p-4 font-mono text-slate-600">{record.serial}</td>
                                        <td className="p-4">{record.soldierName}</td>
                                        <td className="p-4">{record.personalNumber}</td>
                                        <td className="p-4 text-sm text-slate-500">{formatDate(record.timestamp)}</td>
                                      </tr>
                                  ))}
                                  </tbody>
                                </table>
                              </div>
                          );
                        })()}
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50">
                          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-slate-500" />
                            היסטוריית פעולות (יומן מערכת)
                          </h2>
                        </div>

                        {submissionHistory.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                              אין היסטוריית פעולות.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                              {submissionHistory.map((entry) => (
                                  <div key={entry.id} className="p-4 hover:bg-slate-50">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-500">
                                {formatDate(entry.timestamp)}
                              </span>
                                        {(entry.soldierName || entry.personalNumber) && (
                                            <span className="text-sm font-semibold text-slate-800 mt-1">
                                  {entry.soldierName || 'לא הוזן שם'} {entry.personalNumber ? `(מ.א: ${entry.personalNumber})` : ''}
                                              {entry.isUpdate && <span className="mr-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">עדכון ציוד</span>}
                                </span>
                                        )}
                                      </div>
                                      <div className="flex flex-col items-end gap-1">
                              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                                מ.בקשה: {entry.id.slice(0, 6)}...
                              </span>
                                        {entry.submitter && (
                                            <span className="text-xs text-slate-400">עודכן ע״י: {entry.submitter}</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {Object.entries(entry.items || {}).map(([item, qty]) => {
                                        const isReturn = qty < 0;
                                        return (
                                            <div key={item} className={`text-sm px-3 py-1 rounded-full flex gap-1 border ${isReturn ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                                              <span>{isReturn ? 'החזרה:' : 'משיכה:'} {item}</span>
                                              <span className="font-bold">x{Math.abs(qty)}</span>
                                            </div>
                                        );
                                      })}
                                      {(entry.weapons || []).map((w, idx) => (
                                          <div key={`w-${idx}`} className="text-sm bg-red-50 border border-red-200 text-red-800 px-3 py-1 rounded-full flex gap-1">
                                            <span>משיכת נשק: {w.type}</span>
                                            <span className="font-bold">({w.serial})</span>
                                          </div>
                                      ))}
                                      {(entry.returnedWeapons || []).map((w, idx) => (
                                          <div key={`rw-${idx}`} className="text-sm bg-orange-50 border border-orange-200 text-orange-800 px-3 py-1 rounded-full flex gap-1">
                                            <span>החזרת נשק: {w.type}</span>
                                            <span className="font-bold">({w.serial})</span>
                                          </div>
                                      ))}
                                      {(entry.optics || []).map((o, idx) => (
                                          <div key={`o-${idx}`} className="text-sm bg-indigo-50 border border-indigo-200 text-indigo-800 px-3 py-1 rounded-full flex gap-1">
                                            <span>משיכת אופטיקה: {o.type}</span>
                                            <span className="font-bold">({o.serial})</span>
                                          </div>
                                      ))}
                                      {(entry.returnedOptics || []).map((o, idx) => (
                                          <div key={`ro-${idx}`} className="text-sm bg-purple-50 border border-purple-200 text-purple-800 px-3 py-1 rounded-full flex gap-1">
                                            <span>החזרת אופטיקה: {o.type}</span>
                                            <span className="font-bold">({o.serial})</span>
                                          </div>
                                      ))}
                                      {(entry.comms || []).map((c, idx) => (
                                          <div key={`c-${idx}`} className="text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full flex gap-1">
                                            <span>משיכת תקשוב: {c.type}</span>
                                            <span className="font-bold">({c.serial})</span>
                                          </div>
                                      ))}
                                      {(entry.returnedComms || []).map((c, idx) => (
                                          <div key={`rc-${idx}`} className="text-sm bg-green-50 border border-green-200 text-green-800 px-3 py-1 rounded-full flex gap-1">
                                            <span>החזרת תקשוב: {c.type}</span>
                                            <span className="font-bold">({c.serial})</span>
                                          </div>
                                      ))}
                                    </div>
                                  </div>
                              ))}
                            </div>
                        )}
                      </div>
                    </>
                )}
              </div>
          )}

        </main>
      </div>
  );
}