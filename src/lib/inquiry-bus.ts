type InquiryListener = (payload: { type: string; inquiryId?: string; at: string }) => void;

const globalForBus = globalThis as unknown as {
  inquiryListeners?: Set<InquiryListener>;
};

const listeners = globalForBus.inquiryListeners ?? new Set<InquiryListener>();
globalForBus.inquiryListeners = listeners;

export function publishInquiryEvent(type: string, inquiryId?: string) {
  const payload = { type, inquiryId, at: new Date().toISOString() };
  for (const listener of listeners) {
    try {
      listener(payload);
    } catch {
      // ignore broken listeners
    }
  }
}

export function subscribeInquiryEvents(listener: InquiryListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
