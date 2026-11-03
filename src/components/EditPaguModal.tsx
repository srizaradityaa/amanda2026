// TA-02 — Ubah Pagu Induk TA Draft.
import { useState } from 'react';
import { Button, Field, Modal, RupiahInput, useToast } from '@/components/ui';
import { repo } from '@/data/repo';
import { recordAudit } from '@/lib/audit';
import { formatRupiah } from '@/lib/format';

export function EditPaguModal({ taId, onClose, onSaved }: { taId: string; onClose: () => void; onSaved: () => void }) {
  const ta = repo.tahunAnggaranById(taId)!;
  const toast = useToast();
  const [pagu, setPagu] = useState(ta.pagu_induk);
  const [err, setErr] = useState('');

  const save = () => {
    if (pagu <= 0) return setErr('Pagu Induk harus lebih dari 0.');
    repo.editPaguInduk(taId, pagu);
    recordAudit({ ta_id: taId, entitas: `TA ${ta.tahun}`, aksi: 'aksi_administratif', nilai_sebelum: formatRupiah(ta.pagu_induk), nilai_sesudah: formatRupiah(pagu) });
    toast.notify('Tersimpan');
    onSaved();
  };

  return (
    <Modal open onClose={onClose} title={`Ubah Pagu Induk TA ${ta.tahun}`}
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Simpan</Button></div>}>
      <Field label="Pagu Induk (Rupiah)" required hint="Bilangan bulat rupiah tanpa sen. Hanya dapat diubah selama TA berstatus Draft.">
        <RupiahInput value={pagu} onChange={setPagu} />
      </Field>
    </Modal>
  );
}
