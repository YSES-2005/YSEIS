import { describe, it, expect } from 'vitest';
import { Server } from 'socket.io';
import { setIO, getIO } from '../lib/socket';

describe('Socket IO Registry (backend/lib/socket.ts)', () => {
  it('stores and retrieves the global socket.io server instance', () => {
    expect(getIO()).toBeNull();

    const mockIO = {} as Server;
    setIO(mockIO);

    expect(getIO()).toBe(mockIO);
  });
});
