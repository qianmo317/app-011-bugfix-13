import type { Opening, Room } from '../types';
import { polygonArea, polygonPerimeter } from './geometry';

export interface RoomMeasurements {
  floorAreaM2: number;
  perimeterMm: number;
  wallArea: number;
  openingArea: number;
  netWallArea: number;
  doorWidthMm: number;
  netSkirtingLenMm: number;
}

export function getRoomFloorAreaM2(room: Room): number {
  return polygonArea(room.polygon);
}

export function getRoomMeasurements(room: Room, openings: Opening[]): RoomMeasurements {
  const perimeterMm = polygonPerimeter(room.polygon);
  const wallArea = perimeterMm * room.heightMm;
  const roomOpenings = openings.filter((opening) => opening.roomId === room.id);
  const openingArea = roomOpenings.reduce(
    (sum, opening) => sum + opening.widthMm * opening.heightMm,
    0
  );
  const doorWidthMm = roomOpenings
    .filter((opening) => opening.type === 'door' || opening.type === 'sliding')
    .reduce((sum, opening) => sum + opening.widthMm, 0);

  return {
    floorAreaM2: getRoomFloorAreaM2(room),
    perimeterMm,
    wallArea,
    openingArea,
    netWallArea: Math.max(0, wallArea - openingArea),
    doorWidthMm,
    netSkirtingLenMm: Math.max(0, perimeterMm - doorWidthMm),
  };
}

export function isValidRoomHeightMm(value: string): boolean {
  if (value.trim() === '') return false;
  const height = Number(value);
  return Number.isFinite(height) && height > 0;
}
