        // Extraer años únicos de las fechas
        const years = [...new Set(jsonData.map((item: Record<string, unknown>) => {
          const date = new Date(Number(item.Fechapedido))
          return date.getFullYear().toString()
        }))].sort() 