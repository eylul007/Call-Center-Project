namespace CagriMerkeziAPI.Models
{
    public class Cagri
    {
        public int cagri_id { get; set; }
        public string musteri_ad { get; set; } = string.Empty;
        public string musteri_soyad { get; set; } = string.Empty;
        public string musteri_telNo { get; set; } = string.Empty;
        public string musteri_email { get; set; } = string.Empty;
        public string sorun_basligi { get; set; } = string.Empty;
        public string sorun_aciklamasi { get; set; } = string.Empty;
        public DateTime kayit_tarihi { get; set; }
        public DateTime termin_tarihi { get; set; }
        public DateTime servis_tarihi { get; set; }
        public int servis_ucreti { get; set; }
        public int personel_id { get; set; }
        public int urun_grubu { get; set; }
        public string cihaz_ismi { get; set; } = string.Empty;


    }
}
