create extension if not exists pgcrypto;

create table if not exists public.warehouses (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 created_at timestamptz not null default now()
);

create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 barcode text not null unique,
 sku text unique,
 unit text not null default 'حبة',
 category text,
 min_stock numeric not null default 0 check (min_stock >= 0),
 active boolean not null default true,
 created_at timestamptz not null default now()
);

create table if not exists public.stock (
 id uuid primary key default gen_random_uuid(),
 warehouse_id uuid not null references public.warehouses(id) on delete cascade,
 product_id uuid not null references public.products(id) on delete cascade,
 quantity numeric not null default 0 check (quantity >= 0),
 updated_at timestamptz not null default now(),
 unique (warehouse_id, product_id)
);

create table if not exists public.stock_receipts (
 id uuid primary key default gen_random_uuid(),
 warehouse_id uuid not null references public.warehouses(id),
 product_id uuid not null references public.products(id),
 quantity numeric not null check (quantity > 0),
 received_by uuid references auth.users(id),
 note text,
 created_at timestamptz not null default now()
);

create table if not exists public.stock_issues (
 id uuid primary key default gen_random_uuid(),
 warehouse_id uuid not null references public.warehouses(id),
 product_id uuid not null references public.products(id),
 quantity numeric not null check (quantity > 0),
 received_by_name text not null,
 reason text not null,
 issued_by uuid references auth.users(id),
 note text,
 created_at timestamptz not null default now()
);

create or replace function public.issue_stock(
 p_warehouse_id uuid, p_product_id uuid, p_quantity numeric,
 p_received_by_name text, p_reason text, p_note text default null
) returns public.stock_issues
language plpgsql security definer set search_path=public as $$
declare s public.stock; x public.stock_issues;
begin
 if p_quantity <= 0 then raise exception 'الكمية يجب أن تكون أكبر من صفر'; end if;
 select * into s from public.stock
 where warehouse_id=p_warehouse_id and product_id=p_product_id for update;
 if not found then raise exception 'الصنف غير موجود في هذا المخزن'; end if;
 if s.quantity < p_quantity then raise exception 'الكمية غير كافية. المتوفر: %',s.quantity; end if;
 update public.stock set quantity=quantity-p_quantity,updated_at=now() where id=s.id;
 insert into public.stock_issues
 (warehouse_id,product_id,quantity,received_by_name,reason,issued_by,note)
 values(p_warehouse_id,p_product_id,p_quantity,p_received_by_name,p_reason,auth.uid(),p_note)
 returning * into x;
 return x;
end $$;

create or replace function public.receive_stock(
 p_warehouse_id uuid,p_product_id uuid,p_quantity numeric,p_note text default null
) returns public.stock
language plpgsql security definer set search_path=public as $$
declare s public.stock;
begin
 if p_quantity <= 0 then raise exception 'الكمية يجب أن تكون أكبر من صفر'; end if;
 insert into public.stock(warehouse_id,product_id,quantity)
 values(p_warehouse_id,p_product_id,p_quantity)
 on conflict(warehouse_id,product_id) do update
 set quantity=public.stock.quantity+excluded.quantity,updated_at=now()
 returning * into s;
 insert into public.stock_receipts(warehouse_id,product_id,quantity,received_by,note)
 values(p_warehouse_id,p_product_id,p_quantity,auth.uid(),p_note);
 return s;
end $$;

create or replace view public.warehouse_stock_view as
select s.warehouse_id,w.name warehouse_name,s.product_id,p.name product_name,
p.barcode,p.sku,p.unit,p.min_stock,s.quantity,
(s.quantity <= p.min_stock) low_stock
from public.stock s join public.warehouses w on w.id=s.warehouse_id
join public.products p on p.id=s.product_id where p.active=true;

insert into public.warehouses(name)
select 'مخزن Sumer Rest'
where not exists(select 1 from public.warehouses where name='مخزن Sumer Rest');

insert into public.products(name,barcode,sku,unit,category,min_stock)
values('كارتون ماء','1234567890123','WATER-001','كرتون','مشروبات',5)
on conflict(barcode) do nothing;

insert into public.stock(warehouse_id,product_id,quantity)
select w.id,p.id,20 from public.warehouses w,public.products p
where w.name='مخزن Sumer Rest' and p.barcode='1234567890123'
on conflict(warehouse_id,product_id) do nothing;
