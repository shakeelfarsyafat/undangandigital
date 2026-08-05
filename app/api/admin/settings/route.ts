import { NextResponse } from "next/server";
import {
  getWeddingSettings,
  updateWeddingSettings,
  getEvents,
  updateEvents,
  getBankAccounts,
  updateBankAccounts,
  getGallery,
  updateGallery,
  getLoveStories,
  updateLoveStories,
} from "@/lib/data-store";

export async function GET() {
  try {
    const settings = await getWeddingSettings();
    const events = await getEvents();
    const banks = await getBankAccounts();
    const gallery = await getGallery();
    const loveStories = await getLoveStories();
    return NextResponse.json({ settings, events, banks, gallery, loveStories });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat pengaturan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let updatedSettings = null;
    let updatedEventsList = null;
    let updatedBanksList = null;
    let updatedGalleryList = null;
    let updatedStoriesList = null;

    if (body.settings) {
      updatedSettings = await updateWeddingSettings(body.settings);
    } else {
      updatedSettings = await updateWeddingSettings({
        groomName: body.groomName,
        groomFullName: body.groomFullName,
        groomFather: body.groomFather,
        groomMother: body.groomMother,
        groomPhotoUrl: body.groomPhotoUrl,
        brideName: body.brideName,
        brideFullName: body.brideFullName,
        brideFather: body.brideFather,
        brideMother: body.brideMother,
        bridePhotoUrl: body.bridePhotoUrl,
        heroPhotoUrl: body.heroPhotoUrl,
        weddingDate: body.weddingDate,
      });
    }

    if (body.events && Array.isArray(body.events)) {
      updatedEventsList = await updateEvents(body.events);
    }

    if (body.banks && Array.isArray(body.banks)) {
      updatedBanksList = await updateBankAccounts(body.banks);
    }

    if (body.gallery && Array.isArray(body.gallery)) {
      updatedGalleryList = await updateGallery(body.gallery);
    }

    if (body.loveStories && Array.isArray(body.loveStories)) {
      updatedStoriesList = await updateLoveStories(body.loveStories);
    }

    return NextResponse.json({
      settings: updatedSettings,
      events: updatedEventsList,
      banks: updatedBanksList,
      gallery: updatedGalleryList,
      loveStories: updatedStoriesList,
      message: "Pengaturan berhasil disimpan",
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan pengaturan" }, { status: 500 });
  }
}
