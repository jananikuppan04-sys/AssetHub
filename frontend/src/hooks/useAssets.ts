import { useState, useEffect, useCallback } from 'react';
import { assetService } from '@/services/asset.service';
import type { FilterState, Asset, AssetTimelineEvent, AssetDocument } from '@/types';

export function useAssets(filters?: FilterState) {
  const [data, setData] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await assetService.getAssets(filters);
      setData(res.data.data);
      setTotal(res.data.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch assets');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, total, isLoading, error, refresh: fetch };
}

export function useAssetDetails(id: string | undefined) {
  const [data, setData] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await assetService.getAsset(id);
      setData(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch asset details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, isLoading, error, refresh: fetch };
}

export function useAssetTimeline(id: string | undefined) {
  const [data, setData] = useState<AssetTimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await assetService.getAssetTimeline(id);
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch timeline');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, isLoading, error, refresh: fetch };
}

export function useAssetDocuments(id: string | undefined) {
  const [data, setData] = useState<AssetDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await assetService.getAssetDocuments(id);
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, isLoading, error, refresh: fetch };
}
